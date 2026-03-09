import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: 'https://carlmlane.com',
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
];

export default sitemap;
