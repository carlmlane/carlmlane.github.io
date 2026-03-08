# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev`
- **Build:** `pnpm build` (static export to `out/`)
- **Start:** `pnpm start`
- **Lint:** `pnpm lint` (runs `biome check`)
- **Format:** `pnpm format` (runs `biome format --write`)

## Architecture

This is a personal GitHub Pages site built with **Next.js 16** (App Router) configured for **static export** (`output: 'export'` in `next.config.ts`).

- **Runtime:** Node 22 (`.nvmrc`)
- **Package manager:** pnpm
- **Styling:** Tailwind CSS v4 via PostCSS
- **Linting/Formatting:** Biome (single quotes, 2-space indent, 120 char line width)
- **React Compiler** enabled for automatic optimizations
- **Custom domain:** github.carlmlane.com (see `CNAME`)

### Source structure

- `src/app/` — Next.js App Router pages and layouts
- `src/app/globals.css` — Tailwind imports and CSS custom properties (light/dark themes)
- `public/` — Static assets (SVGs)
- `archive/` — Legacy static HTML files (excluded from linting)

### Key config

- **Path alias:** `@/*` maps to `./src/*` (tsconfig)
- **Fonts:** Geist Sans and Geist Mono via `next/font/google`
