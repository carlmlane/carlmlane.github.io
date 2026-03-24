import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BlogGrid from './blog-grid';

type MockProps = { children?: React.ReactNode; [key: string]: unknown };

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: MockProps) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: MockProps) => <article {...props}>{children}</article>,
  },
}));

afterEach(cleanup);

const mockPosts = [
  {
    title: 'Post 1',
    date: '2026-03-22',
    description: 'Desc 1',
    tags: ['a'],
    published: true,
    slug: 'post-1',
  },
  {
    title: 'Post 2',
    date: '2026-03-21',
    description: 'Desc 2',
    tags: ['b'],
    published: true,
    slug: 'post-2',
  },
];

describe('BlogGrid', () => {
  it('renders correct number of posts', () => {
    const { getAllByRole } = render(<BlogGrid posts={mockPosts} />);
    expect(getAllByRole('article')).toHaveLength(2);
  });

  it('renders empty message when no posts', () => {
    const { getByText } = render(<BlogGrid posts={[]} />);
    expect(getByText('No posts found.')).toBeInTheDocument();
  });
});
