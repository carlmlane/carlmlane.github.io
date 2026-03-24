import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const mockPosts = [
  { title: 'Post A', date: '2026-03-22', description: 'Desc', tags: ['react'], published: true, slug: 'post-a' },
];

vi.mock('@/lib/blog', () => ({
  getPostsByTag: vi.fn().mockResolvedValue(mockPosts),
  getAllTags: vi.fn().mockResolvedValue(['react', 'typescript']),
  formatPostDate: vi.fn().mockReturnValue('Mar 22, 2026'),
}));

vi.mock('@/components/blog/blog-grid', () => ({
  default: ({ posts }: { posts: unknown[] }) => <div data-testid="blog-grid">{posts.length} posts</div>,
}));

vi.mock('@/components/blog/tag-filter', () => ({
  default: ({ tags, activeTag }: { tags: string[]; activeTag?: string }) => (
    <div data-testid="tag-filter" data-active={activeTag}>
      {tags.join(',')}
    </div>
  ),
}));

const { default: TagPage, generateStaticParams, generateMetadata, dynamicParams } = await import('./page');

afterEach(cleanup);

describe('TagPage constants', () => {
  it('has dynamicParams set to false', () => {
    expect(dynamicParams).toBe(false);
  });
});

describe('generateStaticParams', () => {
  it('returns tag objects for all tags', async () => {
    const params = await generateStaticParams();
    expect(params).toEqual([{ tag: 'react' }, { tag: 'typescript' }]);
  });
});

describe('generateMetadata', () => {
  it('returns metadata with tag in title', async () => {
    const meta = await generateMetadata({ params: Promise.resolve({ tag: 'react' }) });
    expect(meta.title).toContain('react');
    expect(meta.openGraph).toMatchObject({ type: 'website', url: 'https://carlmlane.com/blog/tag/react' });
    expect(meta.alternates).toMatchObject({ canonical: 'https://carlmlane.com/blog/tag/react' });
  });
});

describe('TagPage', () => {
  it('renders heading with tag name', async () => {
    const { getByRole } = render(await TagPage({ params: Promise.resolve({ tag: 'react' }) }));
    expect(getByRole('heading', { level: 1 }).textContent).toContain('react');
  });

  it('renders TagFilter with activeTag', async () => {
    const { getByTestId } = render(await TagPage({ params: Promise.resolve({ tag: 'react' }) }));
    const filter = getByTestId('tag-filter');
    expect(filter).toHaveAttribute('data-active', 'react');
    expect(filter.textContent).toContain('react,typescript');
  });

  it('renders BlogGrid with filtered posts', async () => {
    const { getByTestId } = render(await TagPage({ params: Promise.resolve({ tag: 'react' }) }));
    expect(getByTestId('blog-grid')).toHaveTextContent('1 posts');
  });
});
