import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BlogCard from './blog-card';

vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) => (
      <article {...props}>{children}</article>
    ),
  },
}));

afterEach(cleanup);

const mockPost = {
  title: 'Test Post',
  date: '2026-03-22',
  description: 'A test description.',
  tags: ['react', 'typescript'],
  published: true,
  slug: 'test-post',
};

describe('BlogCard', () => {
  it('renders post title', () => {
    const { getByText } = render(<BlogCard post={mockPost} index={0} />);
    expect(getByText('Test Post')).toBeInTheDocument();
  });

  it('renders post description', () => {
    const { getByText } = render(<BlogCard post={mockPost} index={0} />);
    expect(getByText('A test description.')).toBeInTheDocument();
  });

  it('renders formatted date', () => {
    const { container } = render(<BlogCard post={mockPost} index={0} />);
    const time = container.querySelector('time');
    expect(time).toBeInTheDocument();
    expect(time?.getAttribute('datetime')).toBe('2026-03-22');
  });

  it('renders tags', () => {
    const { getByText } = render(<BlogCard post={mockPost} index={0} />);
    expect(getByText('react')).toBeInTheDocument();
    expect(getByText('typescript')).toBeInTheDocument();
  });

  it('links to the correct blog post', () => {
    const { getByRole } = render(<BlogCard post={mockPost} index={0} />);
    expect(getByRole('link')).toHaveAttribute('href', '/blog/test-post');
  });
});
