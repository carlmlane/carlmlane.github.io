import { describe, expect, it } from 'vitest';
import type { FeedConfig } from './feed';
import { escapeXml, formatRfc2822, generateRssFeed } from './feed';
import type { BlogPost } from './schemas';

const createMockBlogPost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  title: 'Test Post',
  date: '2026-03-22',
  description: 'A test post description.',
  tags: ['react', 'typescript'],
  published: true,
  slug: 'test-post',
  ...overrides,
});

const defaultConfig: FeedConfig = {
  siteUrl: 'https://example.com',
  title: 'Test Blog',
  description: 'A test blog feed',
  language: 'en-us',
};

describe('escapeXml', () => {
  it('escapes ampersands', () => {
    expect(escapeXml('AT&T')).toBe('AT&amp;T');
  });

  it('escapes angle brackets', () => {
    expect(escapeXml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('escapes single quotes', () => {
    expect(escapeXml("it's")).toBe('it&apos;s');
  });

  it('handles strings with no special characters', () => {
    expect(escapeXml('hello world')).toBe('hello world');
  });

  it('handles empty strings', () => {
    expect(escapeXml('')).toBe('');
  });

  it('escapes multiple special characters in sequence', () => {
    expect(escapeXml('a&b<c>d"e\'f')).toBe('a&amp;b&lt;c&gt;d&quot;e&apos;f');
  });
});

describe('formatRfc2822', () => {
  it('formats an ISO date string to RFC 2822', () => {
    const result = formatRfc2822('2026-03-22');
    expect(result).toMatch(/Sun, 22 Mar 2026/);
    expect(result).toMatch(/GMT$/);
  });
});

describe('generateRssFeed', () => {
  it('generates valid XML with correct channel metadata', () => {
    const xml = generateRssFeed([], defaultConfig);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('xmlns:atom="http://www.w3.org/2005/Atom"');
    expect(xml).toContain('<title>Test Blog</title>');
    expect(xml).toContain('<link>https://example.com</link>');
    expect(xml).toContain('<description>A test blog feed</description>');
    expect(xml).toContain('<language>en-us</language>');
  });

  it('includes atom:link self-reference', () => {
    const xml = generateRssFeed([], defaultConfig);
    expect(xml).toContain('<atom:link href="https://example.com/feed.xml" rel="self" type="application/rss+xml"/>');
  });

  it('produces valid XML with no items when posts array is empty', () => {
    const xml = generateRssFeed([], defaultConfig);
    expect(xml).not.toContain('<item>');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('</rss>');
  });

  it('renders items with correct structure', () => {
    const post = createMockBlogPost();
    const xml = generateRssFeed([post], defaultConfig);

    expect(xml).toContain('<item>');
    expect(xml).toContain('<title>Test Post</title>');
    expect(xml).toContain('<link>https://example.com/blog/test-post</link>');
    expect(xml).toContain('<description>A test post description.</description>');
    expect(xml).toContain('<guid isPermaLink="true">https://example.com/blog/test-post</guid>');
  });

  it('formats pubDate as RFC 2822', () => {
    const post = createMockBlogPost({ date: '2026-03-22' });
    const xml = generateRssFeed([post], defaultConfig);

    expect(xml).toMatch(/<pubDate>Sun, 22 Mar 2026.*GMT<\/pubDate>/);
  });

  it('includes tags as category elements', () => {
    const post = createMockBlogPost({ tags: ['react', 'nextjs', 'typescript'] });
    const xml = generateRssFeed([post], defaultConfig);

    expect(xml).toContain('<category>react</category>');
    expect(xml).toContain('<category>nextjs</category>');
    expect(xml).toContain('<category>typescript</category>');
  });

  it('renders multiple items in order', () => {
    const posts = [
      createMockBlogPost({ title: 'First', slug: 'first', date: '2026-03-22' }),
      createMockBlogPost({ title: 'Second', slug: 'second', date: '2026-03-20' }),
    ];
    const xml = generateRssFeed(posts, defaultConfig);

    const firstIndex = xml.indexOf('<title>First</title>');
    const secondIndex = xml.indexOf('<title>Second</title>');
    expect(firstIndex).toBeLessThan(secondIndex);
  });

  it('uses the most recent post date as lastBuildDate', () => {
    const posts = [
      createMockBlogPost({ date: '2026-03-22', slug: 'newest' }),
      createMockBlogPost({ date: '2026-01-15', slug: 'older' }),
    ];
    const xml = generateRssFeed(posts, defaultConfig);

    expect(xml).toMatch(/<lastBuildDate>Sun, 22 Mar 2026.*GMT<\/lastBuildDate>/);
  });

  it('escapes special characters in post content', () => {
    const post = createMockBlogPost({
      title: 'React & TypeScript <Guide>',
      description: 'Learn "React" & \'TypeScript\'',
    });
    const xml = generateRssFeed([post], defaultConfig);

    expect(xml).toContain('<title>React &amp; TypeScript &lt;Guide&gt;</title>');
    expect(xml).toContain('<description>Learn &quot;React&quot; &amp; &apos;TypeScript&apos;</description>');
  });
});
