import { describe, expect, it } from 'vitest';
import { countWords, minutesToRead, WORDS_PER_MINUTE } from './reading-time';

describe('countWords', () => {
  it('counts plain prose words', () => {
    expect(countWords('one two three four five')).toBe(5);
  });

  it('returns 0 for empty or whitespace-only content', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   \n  \t ')).toBe(0);
  });

  it('ignores the metadata frontmatter block', () => {
    const raw = `export const metadata = {
  title: 'Hello',
  description: 'Lots of words here that should not count at all',
  tags: ['a', 'b'],
};

Real body content here.`;
    expect(countWords(raw)).toBe(4);
  });

  it('strips fenced code blocks', () => {
    const raw = 'Before code.\n\n```ts\nconst x = 1;\nconst y = 2;\n```\n\nAfter code.';
    expect(countWords(raw)).toBe(4);
  });

  it('keeps link text but drops the url', () => {
    expect(countWords('See [the study](https://example.com/very/long/path) now')).toBe(4);
  });

  it('drops image markup entirely', () => {
    expect(countWords('Intro ![a hiker on a trail](/blog/x/hero.jpg) outro')).toBe(2);
  });

  it('strips JSX tags but keeps their text content', () => {
    expect(countWords('<figure><figcaption>Source data here</figcaption></figure>')).toBe(3);
  });

  it('strips MDX comments', () => {
    expect(countWords('Visible text {/* [UNIQUE INSIGHT] hidden note */} more text')).toBe(4);
  });

  it('ignores markdown heading and emphasis punctuation', () => {
    expect(countWords('## A **bold** heading')).toBe(3);
  });
});

describe('minutesToRead', () => {
  it('rounds to the nearest minute at the configured reading speed', () => {
    expect(minutesToRead(WORDS_PER_MINUTE * 5)).toBe(5);
    expect(minutesToRead(WORDS_PER_MINUTE * 3 + 10)).toBe(3);
  });

  it('never returns less than 1 minute for short posts', () => {
    expect(minutesToRead(0)).toBe(1);
    expect(minutesToRead(20)).toBe(1);
  });
});
