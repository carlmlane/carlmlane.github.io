import type { MetadataRoute } from 'next';
import { getAllTags, getBlogPosts } from '@/lib/blog';

export const dynamic = 'force-static';

const sitemap = async (): Promise<MetadataRoute.Sitemap> => {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()]);

  const blogPostEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `https://carlmlane.com/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const tagEntries: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `https://carlmlane.com/blog/tag/${tag}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.4,
  }));

  return [
    {
      url: 'https://carlmlane.com',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://carlmlane.com/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogPostEntries,
    ...tagEntries,
  ];
};

export default sitemap;
