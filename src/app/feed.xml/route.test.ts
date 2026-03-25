import { describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/blog', () => ({
  getBlogPosts: vi.fn().mockResolvedValue([
    {
      title: 'First Post',
      date: '2026-03-22',
      description: 'Description one',
      tags: ['react'],
      published: true,
      slug: 'first-post',
    },
    {
      title: 'Second Post',
      date: '2026-01-15',
      description: 'Description two',
      tags: ['typescript'],
      published: true,
      slug: 'second-post',
    },
  ]),
}));

const { GET } = await import('./route');

describe('GET /feed.xml', () => {
  it('returns a 200 response', async () => {
    const response = await GET();
    expect(response.status).toBe(200);
  });

  it('returns application/rss+xml content type', async () => {
    const response = await GET();
    expect(response.headers.get('Content-Type')).toBe('application/rss+xml; charset=utf-8');
  });

  it('returns valid RSS XML with channel metadata', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(body).toContain('<rss version="2.0"');
    expect(body).toContain('<title>Carl M. Lane</title>');
    expect(body).toContain('<link>https://carlmlane.com</link>');
  });

  it('includes blog post items', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<title>First Post</title>');
    expect(body).toContain('<link>https://carlmlane.com/blog/first-post</link>');
    expect(body).toContain('<title>Second Post</title>');
    expect(body).toContain('<link>https://carlmlane.com/blog/second-post</link>');
  });

  it('includes category elements from tags', async () => {
    const response = await GET();
    const body = await response.text();

    expect(body).toContain('<category>react</category>');
    expect(body).toContain('<category>typescript</category>');
  });
});
