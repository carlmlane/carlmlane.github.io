import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockPosts = [
  { title: 'Post A', date: '2026-03-22', description: 'Desc A', tags: ['react'], published: true, slug: 'post-a' },
];

vi.mock('@/lib/blog', () => ({
  getBlogPosts: vi.fn().mockResolvedValue(mockPosts),
  getAllTags: vi.fn().mockResolvedValue(['react']),
}));

vi.mock('@/components/blog/blog-grid', () => ({
  default: ({ posts }: { posts: unknown[] }) => <div data-testid="blog-grid">{posts.length} posts</div>,
}));

vi.mock('@/components/blog/tag-filter', () => ({
  default: ({ tags }: { tags: string[] }) => <div data-testid="tag-filter">{tags.join(',')}</div>,
}));

vi.mock('@/components/blog/blog-schema', () => ({
  BlogSchema: ({ posts }: { posts: unknown[] }) => <script data-testid="blog-schema">{JSON.stringify(posts)}</script>,
  BreadcrumbSchema: ({ items }: { items: unknown[] }) => (
    <script data-testid="breadcrumb-schema">{JSON.stringify(items)}</script>
  ),
}));

const { default: BlogPage, metadata } = await import('./page');

afterEach(cleanup);

describe('BlogPage', () => {
  it('renders h1 "Blog"', async () => {
    const { getByRole } = render(await BlogPage());
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Blog');
  });

  it('renders description', async () => {
    const { getByText } = render(await BlogPage());
    expect(getByText(/engineering leadership/)).toBeInTheDocument();
  });

  it('renders BlogGrid with posts', async () => {
    const { getByTestId } = render(await BlogPage());
    expect(getByTestId('blog-grid')).toHaveTextContent('1 posts');
  });

  it('renders TagFilter with tags', async () => {
    const { getByTestId } = render(await BlogPage());
    expect(getByTestId('tag-filter')).toHaveTextContent('react');
  });

  it('renders BlogSchema', async () => {
    const { getByTestId } = render(await BlogPage());
    expect(getByTestId('blog-schema')).toBeInTheDocument();
  });
});

describe('BlogPage metadata', () => {
  it('has correct title', () => {
    expect(metadata.title).toBe('Blog — Carl M. Lane');
  });

  it('has openGraph with website type', () => {
    expect(metadata.openGraph).toMatchObject({ type: 'website', url: 'https://carlmlane.com/blog' });
  });

  it('has canonical URL', () => {
    expect(metadata.alternates).toMatchObject({ canonical: 'https://carlmlane.com/blog' });
  });
});
