import { getBlogPosts } from '@/lib/blog';
import { generateRssFeed } from '@/lib/feed';

export const dynamic = 'force-static';

export const GET = async () => {
  const posts = await getBlogPosts();
  const xml = generateRssFeed(posts, {
    siteUrl: 'https://carlmlane.com',
    title: 'Carl M. Lane',
    description: 'Blog posts by Carl M. Lane — engineering leadership, software development, and more.',
    language: 'en-us',
  });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
