import { describe, expect, it, vi } from 'vitest';
import sitemap from './sitemap';

vi.mock('@/lib/blog', () => ({
  getBlogPosts: vi
    .fn()
    .mockResolvedValue([
      { title: 'Test', date: '2026-03-22', description: 'Desc', tags: ['react'], published: true, slug: 'test-post' },
    ]),
  getAllTags: vi.fn().mockResolvedValue(['react']),
}));

describe('sitemap', () => {
  it('includes the home page entry', async () => {
    const result = await sitemap();
    const home = result.find((e) => e.url === 'https://carlmlane.com');
    expect(home).toBeDefined();
    expect(home?.priority).toBe(1);
  });

  it('includes the blog index', async () => {
    const result = await sitemap();
    const blog = result.find((e) => e.url === 'https://carlmlane.com/blog');
    expect(blog).toBeDefined();
    expect(blog?.priority).toBe(0.8);
  });

  it('includes blog post entries', async () => {
    const result = await sitemap();
    const post = result.find((e) => e.url === 'https://carlmlane.com/blog/test-post');
    expect(post).toBeDefined();
    expect(post?.priority).toBe(0.7);
  });

  it('includes tag entries', async () => {
    const result = await sitemap();
    const tag = result.find((e) => e.url === 'https://carlmlane.com/blog/tag/react');
    expect(tag).toBeDefined();
    expect(tag?.priority).toBe(0.4);
  });
});
