import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: process.env.PAGES_BASE_PATH,
  trailingSlash: process.env.TRAILING_SLASH === 'true',
  reactCompiler: true,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
};

// Turbopack requires MDX plugins to be referenced by name (string) so options stay serializable.
const withMDX = createMDX({
  options: {
    rehypePlugins: [['rehype-slug']],
  },
});

export default withMDX(nextConfig);
