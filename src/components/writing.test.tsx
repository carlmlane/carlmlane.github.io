import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRecentPosts } from '@/lib/blog';
import Writing from './writing';

vi.mock('@/lib/blog', () => ({
  getRecentPosts: vi.fn().mockResolvedValue([
    {
      title: 'Test Post',
      date: '2026-03-22',
      description: 'A test description.',
      tags: ['react'],
      published: true,
      slug: 'test-post',
    },
  ]),
}));

afterEach(cleanup);

describe('Writing with posts', () => {
  it('renders section label', async () => {
    const { getByText } = render(await Writing());
    expect(getByText('// writing')).toBeInTheDocument();
  });

  it('renders blog post links', async () => {
    const { getByText } = render(await Writing());
    expect(getByText('Test Post')).toBeInTheDocument();
  });

  it('renders "View all posts" link', async () => {
    const { getByText } = render(await Writing());
    const link = getByText(/View all posts/);
    expect(link).toHaveAttribute('href', '/blog');
  });
});

describe('Writing with no posts', () => {
  it('renders "Coming soon." when posts array is empty', async () => {
    vi.mocked(getRecentPosts).mockResolvedValueOnce([]);
    const { getByText } = render(await Writing());
    expect(getByText('Coming soon.')).toBeInTheDocument();
  });
});
