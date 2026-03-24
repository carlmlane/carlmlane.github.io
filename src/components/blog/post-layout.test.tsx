import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PostLayout from './post-layout';

type MockProps = { children?: React.ReactNode; [key: string]: unknown };

vi.mock('framer-motion', () => ({
  motion: {
    article: ({ children, ...props }: MockProps) => <article {...props}>{children}</article>,
    a: ({ children, ...props }: MockProps) => <a {...props}>{children}</a>,
  },
}));

afterEach(cleanup);

const mockMetadata = {
  title: 'Test Post Title',
  date: '2026-03-22',
  description: 'A test description.',
  tags: ['react', 'typescript'],
  published: true,
};

describe('PostLayout', () => {
  it('renders the post title as h1', () => {
    const { getByRole } = render(
      <PostLayout metadata={mockMetadata} formattedDate="March 22, 2026">
        Content
      </PostLayout>,
    );
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Test Post Title');
  });

  it('renders time element with dateTime attribute', () => {
    const { container } = render(
      <PostLayout metadata={mockMetadata} formattedDate="March 22, 2026">
        Content
      </PostLayout>,
    );
    const time = container.querySelector('time');
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute('datetime', '2026-03-22');
  });

  it('renders tag chips for each tag', () => {
    const { getByText } = render(
      <PostLayout metadata={mockMetadata} formattedDate="March 22, 2026">
        Content
      </PostLayout>,
    );
    expect(getByText('react')).toBeInTheDocument();
    expect(getByText('typescript')).toBeInTheDocument();
  });

  it('renders children in prose wrapper', () => {
    const { container } = render(
      <PostLayout metadata={mockMetadata} formattedDate="March 22, 2026">
        <p>Post content here</p>
      </PostLayout>,
    );
    const prose = container.querySelector('.prose');
    expect(prose).toBeInTheDocument();
    expect(prose?.textContent).toContain('Post content here');
  });

  it('renders back to blog link', () => {
    const { getByText } = render(
      <PostLayout metadata={mockMetadata} formattedDate="March 22, 2026">
        Content
      </PostLayout>,
    );
    expect(getByText('Back to blog')).toBeInTheDocument();
  });

  it('renders header element', () => {
    const { container } = render(
      <PostLayout metadata={mockMetadata} formattedDate="March 22, 2026">
        Content
      </PostLayout>,
    );
    expect(container.querySelector('header')).toBeInTheDocument();
  });
});
