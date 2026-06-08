import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PostLayout from './post-layout';

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
    const { getByRole } = render(<PostLayout metadata={mockMetadata}>Content</PostLayout>);
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Test Post Title');
  });

  it('renders time element with dateTime attribute', () => {
    const { container } = render(<PostLayout metadata={mockMetadata}>Content</PostLayout>);
    const time = container.querySelector('time');
    expect(time).toBeInTheDocument();
    expect(time).toHaveAttribute('datetime', '2026-03-22');
  });

  it('renders tag chips for each tag', () => {
    const { getByText } = render(<PostLayout metadata={mockMetadata}>Content</PostLayout>);
    expect(getByText('react')).toBeInTheDocument();
    expect(getByText('typescript')).toBeInTheDocument();
  });

  it('renders children in prose wrapper', () => {
    const { container } = render(
      <PostLayout metadata={mockMetadata}>
        <p>Post content here</p>
      </PostLayout>,
    );
    const prose = container.querySelector('.prose');
    expect(prose).toBeInTheDocument();
    expect(prose?.textContent).toContain('Post content here');
  });

  it('renders back to blog link', () => {
    const { getByText } = render(<PostLayout metadata={mockMetadata}>Content</PostLayout>);
    expect(getByText('Back to blog')).toBeInTheDocument();
  });

  it('renders header element', () => {
    const { container } = render(<PostLayout metadata={mockMetadata}>Content</PostLayout>);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders reading time when provided', () => {
    const { getByText } = render(
      <PostLayout metadata={mockMetadata} readingTimeMinutes={6}>
        Content
      </PostLayout>,
    );
    expect(getByText('6 min read')).toBeInTheDocument();
  });

  it('omits reading time when not provided', () => {
    const { queryByText } = render(<PostLayout metadata={mockMetadata}>Content</PostLayout>);
    expect(queryByText(/min read/)).not.toBeInTheDocument();
  });
});
