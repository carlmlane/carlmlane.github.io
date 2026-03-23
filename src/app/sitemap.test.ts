import { describe, expect, it, vi } from 'vitest';
import sitemap from './sitemap';

vi.mock('@/lib/blog', () => ({
  getBlogPosts: vi.fn().mockResolvedValue([
    { title: 'First', date: '2026-03-22', description: 'D1', tags: ['react'], published: true, slug: 'first-post' },
    {
      title: 'Second',
      date: '2026-01-15',
      description: 'D2',
      tags: ['typescript'],
      published: true,
      slug: 'second-post',
    },
  ]),
  getAllTags: vi.fn().mockResolvedValue(['react', 'typescript']),
}));

describe('sitemap', () => {
  it('includes the home page entry', async () => {
    const result = await sitemap();
    const home = result.find((e) => e.url === 'https://carlmlane.com');
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
    expect(home?.changeFrequency).toBe('monthly');
  });

  it('includes the blog index', async () => {
    const result = await sitemap();
    const blog = result.find((e) => e.url === 'https://carlmlane.com/blog');
    expect(blog).toBeDefined();
    expect(blog?.priority).toBe(0.8);
    expect(blog?.changeFrequency).toBe('weekly');
  });

  it('includes all blog post entries with correct metadata', async () => {
    const result = await sitemap();

    const firstPost = result.find((e) => e.url === 'https://carlmlane.com/blog/first-post');
    expect(firstPost).toBeDefined();
    expect(firstPost?.priority).toBe(0.7);
    expect(firstPost?.changeFrequency).toBe('monthly');
    expect(firstPost?.lastModified).toEqual(new Date('2026-03-22'));

    const secondPost = result.find((e) => e.url === 'https://carlmlane.com/blog/second-post');
    expect(secondPost).toBeDefined();
    expect(secondPost?.priority).toBe(0.7);
    expect(secondPost?.changeFrequency).toBe('monthly');
    expect(secondPost?.lastModified).toEqual(new Date('2026-01-15'));
  });

  it('includes all tag entries with correct metadata', async () => {
    const result = await sitemap();

    const reactTag = result.find((e) => e.url === 'https://carlmlane.com/blog/tag/react');
    expect(reactTag).toBeDefined();
    expect(reactTag?.priority).toBe(0.4);
    expect(reactTag?.changeFrequency).toBe('weekly');

    const tsTag = result.find((e) => e.url === 'https://carlmlane.com/blog/tag/typescript');
    expect(tsTag).toBeDefined();
    expect(tsTag?.priority).toBe(0.4);
    expect(tsTag?.changeFrequency).toBe('weekly');
  });

  it('contains the expected total number of entries', async () => {
    const result = await sitemap();
    // 2 static (home + blog index) + 2 posts + 2 tags = 6
    expect(result).toHaveLength(6);
  });
});
