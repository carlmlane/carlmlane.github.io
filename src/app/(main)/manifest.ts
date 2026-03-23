import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const manifest = (): MetadataRoute.Manifest => ({
  name: 'Carl M. Lane',
  short_name: 'CML',
  icons: [
    {
      src: '/web-app-manifest-192x192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'maskable',
    },
    {
      src: '/web-app-manifest-512x512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
  theme_color: '#ffffff',
  background_color: '#ffffff',
  display: 'standalone',
});

export default manifest;
