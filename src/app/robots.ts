import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', allow: '/', disallow: ['/new-tab/', '/fantasy/'] },
  sitemap: 'https://carlmlane.com/sitemap.xml',
});

export default robots;
