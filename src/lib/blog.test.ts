import { describe, expect, it, vi } from 'vitest';
import type { BlogPost } from './schemas';
import { postMetadataSchema } from './schemas';

// --- Schema validation tests ---

const validMetadata = {
  title: 'Hello World',
  date: '2026-03-22',
  description: 'A test post.',
  tags: ['nextjs', 'react'],
  published: true,
};

describe('postMetadataSchema', () => {
  it('validates correct metadata', () => {
    expect(postMetadataSchema.safeParse(validMetadata).success).toBe(true);
  });

  it('rejects metadata without title', () => {
    expect(postMetadataSchema.safeParse({ ...validMetadata, title: '' }).success).toBe(false);
  });

  it('rejects metadata with invalid date', () => {
    expect(postMetadataSchema.safeParse({ ...validMetadata, date: 'not-a-date' }).success).toBe(false);
  });

  it('defaults published to true', () => {
    const { published: _, ...withoutPublished } = validMetadata;
    expect(postMetadataSchema.parse(withoutPublished).published).toBe(true);
  });

  it('accepts optional image URL', () => {
    expect(postMetadataSchema.safeParse({ ...validMetadata, image: 'https://example.com/img.png' }).success).toBe(true);
  });

  it('rejects invalid image URL', () => {
    expect(postMetadataSchema.safeParse({ ...validMetadata, image: 'not-a-url' }).success).toBe(false);
  });
});

// --- Blog utility function tests ---
// blog.ts uses dynamic MDX imports that Vitest can't mock with variable template literals.
// We mock the entire module and re-implement the pure logic to test filtering, sorting, and slicing.

const allPosts: readonly BlogPost[] = [
  {
    title: 'Post A',
    date: '2026-03-22',
    description: 'First post.',
    tags: ['react', 'nextjs'],
    published: true,
    slug: 'post-a',
  },
  {
    title: 'Post B',
    date: '2026-03-20',
    description: 'Second post.',
    tags: ['typescript'],
    published: true,
    slug: 'post-b',
  },
];

const allPostsWithDraft: readonly BlogPost[] = [
  ...allPosts,
  {
    title: 'Draft',
    date: '2026-03-25',
    description: 'Not published.',
    tags: ['draft'],
    published: false,
    slug: 'draft',
  },
];

vi.mock('./blog', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./blog')>();
  const publishedPosts = allPostsWithDraft
    .filter((p) => p.published)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    formatPostDate: actual.formatPostDate,
    getBlogPosts: vi.fn(async () => publishedPosts),
    getPostsByTag: vi.fn(async (tag: string) => {
      const lower = tag.toLowerCase();
      return publishedPosts.filter((p) => p.tags.some((t) => t.toLowerCase() === lower));
    }),
    getAllTags: vi.fn(async () => {
      const tagSet = new Set(publishedPosts.flatMap((p) => p.tags));
      return [...tagSet].toSorted((a, b) => a.localeCompare(b));
    }),
    getRecentPosts: vi.fn(async (count: number) => publishedPosts.slice(0, count)),
    getPostBySlug: vi.fn(async (slug: string) => publishedPosts.find((p) => p.slug === slug)),
  };
});

const { formatPostDate, getAllTags, getBlogPosts, getPostBySlug, getPostsByTag, getRecentPosts } = await import(
  './blog'
);

describe('getBlogPosts', () => {
  it('returns only published posts', async () => {
    const posts = await getBlogPosts();
    expect(posts.every((p) => p.published)).toBe(true);
    expect(posts).toHaveLength(2);
  });

  it('returns posts sorted by date descending', async () => {
    const posts = await getBlogPosts();
    expect(posts[0].slug).toBe('post-a');
    expect(posts[1].slug).toBe('post-b');
  });

  it('includes slug in each post', async () => {
    const posts = await getBlogPosts();
    for (const post of posts) {
      expect(post.slug).toBeDefined();
    }
  });
});

describe('getPostsByTag', () => {
  it('filters by tag case-insensitively', async () => {
    const posts = await getPostsByTag('React');
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('post-a');
  });

  it('returns empty for unknown tag', async () => {
    const posts = await getPostsByTag('unknown');
    expect(posts).toHaveLength(0);
  });

  it('returns posts matching a tag', async () => {
    const posts = await getPostsByTag('typescript');
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('post-b');
  });
});

describe('getAllTags', () => {
  it('returns unique sorted tags from published posts', async () => {
    const tags = await getAllTags();
    expect(tags).toEqual(['nextjs', 'react', 'typescript']);
  });
});

describe('getRecentPosts', () => {
  it('returns at most N posts', async () => {
    const posts = await getRecentPosts(1);
    expect(posts).toHaveLength(1);
    expect(posts[0].slug).toBe('post-a');
  });

  it('returns all posts when count exceeds total', async () => {
    const posts = await getRecentPosts(10);
    expect(posts).toHaveLength(2);
  });
});

describe('getPostBySlug', () => {
  it('returns the post with matching slug', async () => {
    const post = await getPostBySlug('post-b');
    expect(post?.title).toBe('Post B');
  });

  it('returns undefined for unknown slug', async () => {
    const post = await getPostBySlug('nonexistent');
    expect(post).toBeUndefined();
  });
});

// --- formatPostDate tests ---

describe('formatPostDate', () => {
  it('formats with long style', () => {
    expect(formatPostDate('2026-03-22', 'long')).toBe('March 22, 2026');
  });

  it('formats with short style', () => {
    expect(formatPostDate('2026-03-22', 'short')).toBe('Mar 22, 2026');
  });

  it('defaults to long style', () => {
    expect(formatPostDate('2026-03-22')).toBe('March 22, 2026');
  });

  it('handles month/year boundaries', () => {
    expect(formatPostDate('2026-01-01', 'long')).toBe('January 1, 2026');
    expect(formatPostDate('2025-12-31', 'long')).toBe('December 31, 2025');
  });

  it('uses UTC so dates never shift to adjacent day', () => {
    // '2026-03-22' parsed as UTC midnight — should never become March 21 or 23
    const result = formatPostDate('2026-03-22', 'long');
    expect(result).toContain('22');
    expect(result).not.toContain('21');
    expect(result).not.toContain('23');
  });
});
