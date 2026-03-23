import type { Blog, BlogPosting, WithContext } from 'schema-dts';
import type { BlogPost } from '@/lib/schemas';

const createBlogSchema = (posts: readonly BlogPost[]): WithContext<Blog> => ({
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'Carl M. Lane — Blog',
  url: 'https://carlmlane.com/blog',
  description: 'Thoughts on engineering leadership, software development, and team building.',
  author: {
    '@type': 'Person',
    name: 'Carl M. Lane',
    url: 'https://carlmlane.com',
  },
  blogPost: posts.map((post) => ({
    '@type': 'BlogPosting',
    headline: post.title,
    url: `https://carlmlane.com/blog/${post.slug}`,
    datePublished: post.date,
    description: post.description,
  })),
});

const createBlogPostingSchema = (post: BlogPost): WithContext<BlogPosting> => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  url: `https://carlmlane.com/blog/${post.slug}`,
  datePublished: post.date,
  ...(post.lastUpdated ? { dateModified: post.lastUpdated } : {}),
  description: post.description,
  author: {
    '@type': 'Person',
    name: 'Carl M. Lane',
    url: 'https://carlmlane.com',
  },
  publisher: {
    '@type': 'Person',
    name: 'Carl M. Lane',
    url: 'https://carlmlane.com',
  },
  keywords: post.tags,
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': `https://carlmlane.com/blog/${post.slug}`,
  },
  ...(post.image ? { image: post.image } : {}),
});

type BlogSchemaProps = {
  readonly posts: readonly BlogPost[];
};

const BlogSchema = ({ posts }: BlogSchemaProps) => (
  <script type="application/ld+json">{JSON.stringify(createBlogSchema(posts))}</script>
);

type BlogPostingSchemaProps = {
  readonly post: BlogPost;
};

const BlogPostingSchema = ({ post }: BlogPostingSchemaProps) => (
  <script type="application/ld+json">{JSON.stringify(createBlogPostingSchema(post))}</script>
);

export { BlogPostingSchema, BlogSchema, createBlogPostingSchema, createBlogSchema };
