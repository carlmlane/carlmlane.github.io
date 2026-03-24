import slugs from '@/content/blog';
import { type BlogPost, postMetadataSchema } from './schemas';

type DateStyle = 'long' | 'short';

const formatPostDate = (dateStr: string, style: DateStyle = 'long'): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: style,
    day: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(dateStr));

const getBlogPosts = async (): Promise<readonly BlogPost[]> => {
  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const { metadata } = await import(`@/content/blog/${slug}.mdx`);
      const parsed = postMetadataSchema.parse(metadata);
      return { ...parsed, slug } as const;
    }),
  );

  return posts
    .filter((post) => post.published)
    .toSorted((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const getPostsByTag = async (tag: string): Promise<readonly BlogPost[]> => {
  const posts = await getBlogPosts();
  const lowerTag = tag.toLowerCase();
  return posts.filter((post) => post.tags.some((t) => t.toLowerCase() === lowerTag));
};

const getAllTags = async (): Promise<readonly string[]> => {
  const posts = await getBlogPosts();
  const tagSet = new Set(posts.flatMap((post) => post.tags));
  return [...tagSet].toSorted((a, b) => a.localeCompare(b));
};

const getRecentPosts = async (count: number): Promise<readonly BlogPost[]> => {
  const posts = await getBlogPosts();
  return posts.slice(0, count);
};

const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  const posts = await getBlogPosts();
  return posts.find((post) => post.slug === slug);
};

export { formatPostDate, getAllTags, getBlogPosts, getPostBySlug, getPostsByTag, getRecentPosts };
