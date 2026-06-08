// Average adult reading speed for prose; used to derive a reading-time estimate
// from a post's word count at build time.
const WORDS_PER_MINUTE = 220;

// Strip MDX/markdown syntax down to readable prose so the word count reflects
// what a human actually reads, not JSX, code blocks, or markdown punctuation.
const stripToProse = (raw: string): string =>
  raw
    // leading `export const metadata = { ... };` frontmatter block
    .replace(/export\s+const\s+metadata\s*=\s*{[\s\S]*?};/, '')
    // fenced code blocks
    .replace(/```[\s\S]*?```/g, ' ')
    // inline code
    .replace(/`[^`]*`/g, ' ')
    // MDX/JSX comments: {/* ... */}
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, ' ')
    // JSX/HTML tags (keeps any text content between them)
    .replace(/<[^>]+>/g, ' ')
    // images: ![alt](url) — drop entirely, they aren't read
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    // links: [text](url) — keep the visible text only
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // remaining markdown punctuation (headings, emphasis, blockquote markers)
    .replace(/[#>*_~]/g, ' ');

const countWords = (raw: string): number => {
  const prose = stripToProse(raw).trim();
  return prose.length === 0 ? 0 : prose.split(/\s+/).length;
};

const minutesToRead = (wordCount: number): number => Math.max(1, Math.round(wordCount / WORDS_PER_MINUTE));

export { countWords, minutesToRead, WORDS_PER_MINUTE };
