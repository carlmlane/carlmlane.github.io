import type { MDXComponents } from 'mdx/types';
import { blogMdxComponents } from '@/components/blog/mdx-components';

export const useMDXComponents = (components: MDXComponents): MDXComponents => ({
  ...components,
  ...blogMdxComponents,
});
