import { describe, expect, it, vi } from 'vitest';

const mockPost = {
  title: 'Test Post',
  date: '2026-03-22',
  description: 'Test description.',
  tags: ['react'],
  published: true,
  slug: 'test-post',
};

vi.mock('@/content/blog', () => ({
  default: ['test-post'],
}));

vi.mock('@/lib/blog', () => ({
  getPostBySlug: vi.fn().mockImplementation(async (slug: string) => {
    if (slug === 'test-post') return mockPost;
    return undefined;
  }),
}));

const { generateStaticParams, generateMetadata, dynamicParams } = await import('./page');

describe('BlogPostPage constants', () => {
  it('has dynamicParams set to false', () => {
    expect(dynamicParams).toBe(false);
  });
});

describe('generateStaticParams', () => {
  it('returns slug objects for all posts', () => {
    const params = generateStaticParams();
    expect(params).toEqual([{ slug: 'test-post' }]);
  });
});

describe('generateMetadata', () => {
  it('returns metadata for a valid post', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'test-post' }) });
    expect(meta.title).toBe('Test Post — Carl M. Lane');
    expect(meta.description).toBe('Test description.');
    expect(meta.openGraph).toMatchObject({ type: 'article', publishedTime: '2026-03-22' });
    expect(meta.alternates).toMatchObject({ canonical: 'https://carlmlane.com/blog/test-post' });
  });

  it('returns correct OG tags array', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'test-post' }) });
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.tags).toEqual(['react']);
  });

  it('returns "Post Not Found" for missing post', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ slug: 'nonexistent' }) });
    expect(meta.title).toBe('Post Not Found');
  });
});
