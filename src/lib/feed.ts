import type { BlogPost } from './schemas';

type FeedConfig = {
  readonly siteUrl: string;
  readonly title: string;
  readonly description: string;
  readonly language: string;
};

const escapeXml = (str: string): string =>
  str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

const formatRfc2822 = (dateStr: string): string => new Date(dateStr).toUTCString();

const renderItem = (post: BlogPost, siteUrl: string): string => {
  const link = `${siteUrl}/blog/${post.slug}`;
  const categories = post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n');

  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${formatRfc2822(post.date)}</pubDate>
      <guid isPermaLink="true">${link}</guid>
${categories}
    </item>`;
};

const generateRssFeed = (posts: readonly BlogPost[], config: FeedConfig): string => {
  const { siteUrl, title, description, language } = config;
  const feedUrl = `${siteUrl}/feed.xml`;
  const lastBuildDate = posts.length > 0 ? formatRfc2822(posts[0].date) : formatRfc2822(new Date().toISOString());
  const items = posts.map((post) => renderItem(post, siteUrl)).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(description)}</description>
    <language>${language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;
};

export type { FeedConfig };
export { escapeXml, formatRfc2822, generateRssFeed };
