import type { ReactNode } from 'react';

const BlogLayout = ({ children }: { readonly children: ReactNode }) => (
  <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">{children}</div>
);

export default BlogLayout;
