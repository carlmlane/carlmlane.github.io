import { existsSync } from 'node:fs';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import sharp from 'sharp';

// AUTO-RUN via `pnpm generate:image-manifest` (chained into `prebuild`).
// Walks public/blog, re-compresses oversized JPEGs in place, emits resized
// .webp/.avif variants at several widths, and writes intrinsic dimensions plus
// width-descriptor srcsets to src/lib/image-manifest.json.
// The manifest is committed (CI typecheck/test/lint run without prebuild); the
// generated .webp/.avif variants are gitignored and regenerated at build time.

const scriptDir = import.meta.dirname ?? new URL('.', import.meta.url).pathname;
const projectRoot = resolve(scriptDir, '..');
const publicDir = join(projectRoot, 'public');
const blogDir = join(publicDir, 'blog');
const manifestPath = join(projectRoot, 'src', 'lib', 'image-manifest.json');

const sourceExtensions = new Set(['.jpg', '.jpeg', '.png']);

// Render widths covering 1x/1.5x/2x of the ~720px content column. Widths wider
// than a given image are dropped, and the image's own width is always included.
const targetWidths = [640, 960, 1280];

type ImageEntry = {
  readonly width: number;
  readonly height: number;
  readonly webp: string;
  readonly avif: string;
};

const kb = (bytes: number) => `${Math.round(bytes / 1024)}KB`;

const toPublicPath = (file: string) => `/${relative(publicDir, file).split(sep).join('/')}`;

const variantPath = (file: string, width: number, ext: '.webp' | '.avif') =>
  file.replace(/\.(jpe?g|png)$/i, `-${width}${ext}`);

const collectImages = async (dir: string): Promise<readonly string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) return collectImages(full);
      return sourceExtensions.has(extname(entry.name).toLowerCase()) ? [full] : [];
    }),
  );
  return nested.flat();
};

const isStale = async (source: string, target: string): Promise<boolean> => {
  if (!existsSync(target)) return true;
  const [sourceStat, targetStat] = await Promise.all([stat(source), stat(target)]);
  return sourceStat.mtimeMs > targetStat.mtimeMs;
};

// Re-encode JPEGs with mozjpeg, but only overwrite when meaningfully smaller.
// This keeps the step idempotent and avoids generational quality loss across runs.
const maybeRecompressJpeg = async (file: string): Promise<void> => {
  if (!['.jpg', '.jpeg'].includes(extname(file).toLowerCase())) return;
  const original = await readFile(file);
  const optimized = await sharp(original).jpeg({ quality: 80, mozjpeg: true }).toBuffer();
  if (optimized.length < original.length * 0.9) {
    await writeFile(file, optimized);
    console.log(`Recompressed ${relative(projectRoot, file)} (${kb(original.length)} → ${kb(optimized.length)})`);
  }
};

const ensureVariant = async (
  source: string,
  target: string,
  encode: (img: sharp.Sharp) => sharp.Sharp,
): Promise<void> => {
  if (!(await isStale(source, target))) return;
  await encode(sharp(source)).toFile(target);
  console.log(`Wrote ${relative(projectRoot, target)}`);
};

const buildSrcset = async (
  file: string,
  widths: readonly number[],
  ext: '.webp' | '.avif',
  encode: (img: sharp.Sharp) => sharp.Sharp,
): Promise<string> => {
  const parts = await Promise.all(
    widths.map(async (width) => {
      const target = variantPath(file, width, ext);
      await ensureVariant(file, target, (img) => encode(img.rotate().resize({ width, withoutEnlargement: true })));
      return `${toPublicPath(target)} ${width}w`;
    }),
  );
  return parts.join(', ');
};

const buildEntry = async (file: string): Promise<readonly [string, ImageEntry]> => {
  await maybeRecompressJpeg(file);

  const meta = await sharp(file).metadata();
  if (meta.width === undefined || meta.height === undefined) {
    throw new Error(`Unable to read dimensions for ${relative(projectRoot, file)}`);
  }
  // EXIF orientation values >= 5 swap width/height.
  const swap = (meta.orientation ?? 1) >= 5;
  const width = swap ? meta.height : meta.width;
  const height = swap ? meta.width : meta.height;

  const widths = [...new Set([...targetWidths.filter((w) => w < width), width])].toSorted((a, b) => a - b);
  const webp = await buildSrcset(file, widths, '.webp', (img) => img.webp({ quality: 80 }));
  const avif = await buildSrcset(file, widths, '.avif', (img) => img.avif({ quality: 50 }));

  return [toPublicPath(file), { width, height, webp, avif }];
};

const images = await collectImages(blogDir);
const entries = await Promise.all(images.map(buildEntry));
const manifest = Object.fromEntries([...entries].toSorted(([a], [b]) => a.localeCompare(b)));

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated ${relative(projectRoot, manifestPath)} (${entries.length} images)`);
