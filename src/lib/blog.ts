import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import slugs from '@/content/blog';
import { countWords, minutesToRead } from './reading-time';
import { type BlogPost, postMetadataSchema } from './schemas';

const getBlogPosts = async (): Promise<readonly BlogPost[]> => {
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await import(`@/content/blog/${slug}.mdx`);
      const parsed = postMetadataSchema.parse(metadata);
      const raw = await readFile(join(process.cwd(), 'src/content/blog', `${slug}.mdx`), 'utf8');
      const wordCount = parsed.wordCount ?? countWords(raw);
      return { ...parsed, slug, wordCount, readingTimeMinutes: minutesToRead(wordCount) } as const;
    }),
  );

  return posts
    .filter((post) => post.published)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getPostsByTag = async (tag: string): Promise<readonly BlogPost[]> => {
  const posts = await getBlogPosts();
  const lowerTag = tag.toLowerCase();
  return posts.filter((post) => post.tags.some((t) => t.toLowerCase() === lowerTag));
};

const getAllTags = async (): Promise<readonly string[]> => {
  const posts = await getBlogPosts();
  const tagSet = new Set(posts.flatMap((post) => post.tags));
  return [...tagSet].toSorted((a, b) => a.localeCompare(b));
};

const getRecentPosts = async (count: number): Promise<readonly BlogPost[]> => {
  const posts = await getBlogPosts();
  return posts.slice(0, count);
};

const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
};

export { getAllTags, getBlogPosts, getPostBySlug, getPostsByTag, getRecentPosts };
