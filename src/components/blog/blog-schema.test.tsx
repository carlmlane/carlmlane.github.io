import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { BlogPostingSchema, BlogSchema, createBlogPostingSchema, createBlogSchema } from './blog-schema';

afterEach(cleanup);

const mockPost = {
  title: 'Test Post',
  date: '2026-03-22',
  description: 'A test description.',
  tags: ['react'],
  published: true,
  slug: 'test-post',
};

const mockPostWithImage = {
  ...mockPost,
  image: 'https://example.com/image.png',
  slug: 'with-image',
};

describe('createBlogSchema', () => {
  it('has correct @type and @context', () => {
    const schema = createBlogSchema([mockPost]);
    expect(schema['@context']).toBe('https://schema.org');
    expect(schema['@type']).toBe('Blog');
  });

  it('includes blog posts', () => {
    const schema = createBlogSchema([mockPost]);
    const posts = schema.blogPost;
    expect(Array.isArray(posts)).toBe(true);
    expect(posts).toHaveLength(1);
  });

  it('has author info', () => {
    const schema = createBlogSchema([mockPost]);
    expect(schema.author).toMatchObject({ '@type': 'Person', name: 'Carl M. Lane' });
  });
});

describe('createBlogPostingSchema', () => {
  it('has correct @type', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema['@type']).toBe('BlogPosting');
  });

  it('has correct headline and url', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema.headline).toBe('Test Post');
    expect(schema.url).toBe('https://carlmlane.com/blog/test-post');
  });

  it('has author info', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema.author).toEqual({ '@type': 'Person', name: 'Carl M. Lane', url: 'https://carlmlane.com' });
  });

  it('has publisher info', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema.publisher).toEqual({ '@type': 'Person', name: 'Carl M. Lane', url: 'https://carlmlane.com' });
  });

  it('includes keywords', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema.keywords).toEqual(['react']);
  });

  it('has mainEntityOfPage', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema.mainEntityOfPage).toMatchObject({ '@type': 'WebPage' });
  });

  it('includes image when provided', () => {
    const schema = createBlogPostingSchema(mockPostWithImage);
    expect(schema.image).toBe('https://example.com/image.png');
  });

  it('omits image when not provided', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema).not.toHaveProperty('image');
  });
});

describe('BlogSchema component', () => {
  it('renders JSON-LD script tag', () => {
    const { container } = render(<BlogSchema posts={[mockPost]} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    const json = JSON.parse(script?.textContent ?? '{}');
    expect(json['@type']).toBe('Blog');
  });
});

describe('BlogPostingSchema component', () => {
  it('renders JSON-LD script tag', () => {
    const { container } = render(<BlogPostingSchema post={mockPost} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    const json = JSON.parse(script?.textContent ?? '{}');
    expect(json['@type']).toBe('BlogPosting');
    expect(json.headline).toBe('Test Post');
  });
});
