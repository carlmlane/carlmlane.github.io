# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev` (Next.js with experimental HTTPS)
- **Build:** `pnpm build` (static export to `out/`; `prebuild` hook runs `pnpm generate:service-worker` first)
- **Start:** `pnpm start`
- **Lint:** `pnpm lint` (runs `biome check`)
- **Format:** `pnpm format` (runs `biome format --write`)
- **Typecheck:** `pnpm typecheck` (runs `tsc --noEmit`)
- **Unit tests:** `pnpm test` (vitest run) / `pnpm test:watch` / `pnpm test:coverage`
- **E2E tests:** `pnpm test:e2e` (playwright) / `pnpm test:e2e:ui`
- **Run everything:** `pnpm check-all` (build + lint + test + typecheck + e2e in parallel)

A **lefthook pre-commit hook** runs `biome format --write` and `biome check` on every commit. Commits abort if either fails — fix and re-stage rather than bypassing.

## Architecture

This is a personal GitHub Pages site built with **Next.js 16** (App Router) configured for **static export** (`output: 'export'` in `next.config.ts`).

- **Runtime:** Node 22 (`.nvmrc`)
- **Package manager:** pnpm
- **Styling:** Tailwind CSS v4 via PostCSS
- **Linting/Formatting:** Biome (single quotes, 2-space indent, 120 char line width)
- **React Compiler** enabled for automatic optimizations
- **Custom domain:** carlmlane.com (see `CNAME`)

### Source structure

- `src/app/` — Next.js App Router pages and layouts
- `src/app/globals.css` — Tailwind imports and CSS custom properties (light/dark themes)
- `src/components/blog/` — Blog-specific components (`FAQ`, `BlogCard`, `BlogGrid`, `PostLayout`, `mdx-components`, etc.)
- `src/content/blog/` — Blog posts (MDX) plus `index.ts` that registers published slugs
- `src/lib/schemas.ts` — Zod schemas; `postMetadataSchema` validates blog frontmatter at build time
- `public/blog/{slug}/` — Per-post images (hero + inline). Other static assets and the generated `service-worker.js` also live in `public/`
- `scripts/generate-service-worker.ts` — Runs via `prebuild`; output committed to `public/service-worker.js`
- `archive/` — Legacy static HTML files (excluded from linting)

### Key config

- **Path alias:** `@/*` maps to `./src/*` (tsconfig)
- **Fonts:** Geist Sans and Geist Mono via `next/font/google`

## Adding a blog post

1. Create `src/content/blog/<slug>.mdx` with this frontmatter (validated by `postMetadataSchema` in `src/lib/schemas.ts`):
   ```js
   export const metadata = {
     title: '...',
     date: 'YYYY-MM-DD',         // required, ISO date
     description: '...',          // required
     tags: ['ai', 'leadership'],  // required, lowercase
     published: true,             // optional, defaults to true
     image: 'https://carlmlane.com/blog/<slug>/hero.jpg', // optional, must be a full URL
     lastUpdated: 'YYYY-MM-DD',   // optional
   };
   ```
2. Append `'<slug>'` to the tuple in `src/content/blog/index.ts`. Posts not in the tuple don't render.
3. Put images at `public/blog/<slug>/` and reference them inline as `/blog/<slug>/foo.jpg`. The frontmatter `image` field requires the absolute `https://carlmlane.com/...` URL (Zod enforces `.url()`).
4. MDX components are auto-styled via `src/components/blog/mdx-components.tsx`. For FAQ blocks: `import { FAQ } from '@/components/blog/faq';` and wrap each Q&A in a `<div>` with an `<h3>` plus `<p>`.
5. Charts use inline `<svg>` inside `<figure>` with the dark-mode palette (`#5b9ee1`, `#e5a853`, `#7c6fe0`, `#404040`) — see existing posts for the pattern; transparent background, never raster.
