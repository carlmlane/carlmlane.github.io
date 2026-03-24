import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import {
  BlogPostingSchema,
  BlogSchema,
  BreadcrumbSchema,
  createBlogPostingSchema,
  createBlogSchema,
  createBreadcrumbSchema,
} from './blog-schema';

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

const mockPostWithWordCount = {
  ...mockPost,
  wordCount: 1500,
  slug: 'with-word-count',
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

  it('has inLanguage', () => {
    const schema = createBlogSchema([mockPost]);
    expect(schema.inLanguage).toBe('en-US');
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

  it('has inLanguage', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema.inLanguage).toBe('en-US');
  });

  it('includes wordCount when provided', () => {
    const schema = createBlogPostingSchema(mockPostWithWordCount);
    expect(schema.wordCount).toBe(1500);
  });

  it('omits wordCount when not provided', () => {
    const schema = createBlogPostingSchema(mockPost);
    expect(schema).not.toHaveProperty('wordCount');
  });
});

describe('createBreadcrumbSchema', () => {
  const toJson = (items: readonly { name: string; url: string }[]) =>
    JSON.parse(JSON.stringify(createBreadcrumbSchema(items)));

  it('has correct @type and @context', () => {
    const json = toJson([{ name: 'Home', url: 'https://carlmlane.com' }]);
    expect(json['@context']).toBe('https://schema.org');
    expect(json['@type']).toBe('BreadcrumbList');
  });

  it('creates blog index breadcrumb with 2 items', () => {
    const json = toJson([
      { name: 'Home', url: 'https://carlmlane.com' },
      { name: 'Blog', url: 'https://carlmlane.com/blog' },
    ]);
    expect(json.itemListElement).toHaveLength(2);
    expect(json.itemListElement[0]).toMatchObject({ '@type': 'ListItem', position: 1, name: 'Home' });
    expect(json.itemListElement[1]).toMatchObject({ '@type': 'ListItem', position: 2, name: 'Blog' });
  });

  it('creates blog post breadcrumb with 3 items', () => {
    const json = toJson([
      { name: 'Home', url: 'https://carlmlane.com' },
      { name: 'Blog', url: 'https://carlmlane.com/blog' },
      { name: 'Test Post', url: 'https://carlmlane.com/blog/test-post' },
    ]);
    expect(json.itemListElement).toHaveLength(3);
    expect(json.itemListElement[2]).toMatchObject({ '@type': 'ListItem', position: 3, name: 'Test Post' });
  });

  it('includes item URLs', () => {
    const json = toJson([
      { name: 'Home', url: 'https://carlmlane.com' },
      { name: 'Blog', url: 'https://carlmlane.com/blog' },
    ]);
    expect(json.itemListElement[0].item).toBe('https://carlmlane.com');
    expect(json.itemListElement[1].item).toBe('https://carlmlane.com/blog');
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

describe('BreadcrumbSchema component', () => {
  it('renders JSON-LD script tag', () => {
    const items = [
      { name: 'Home', url: 'https://carlmlane.com' },
      { name: 'Blog', url: 'https://carlmlane.com/blog' },
    ];
    const { container } = render(<BreadcrumbSchema items={items} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).toBeInTheDocument();
    const json = JSON.parse(script?.textContent ?? '{}');
    expect(json['@type']).toBe('BreadcrumbList');
    expect(json.itemListElement).toHaveLength(2);
  });
});
