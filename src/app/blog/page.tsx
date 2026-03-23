import type { Metadata } from 'next';
import BlogGrid from '@/components/blog/blog-grid';
import { BlogSchema } from '@/components/blog/blog-schema';
import TagFilter from '@/components/blog/tag-filter';
import { getAllTags, getBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Blog — Carl M. Lane',
  description: 'Thoughts on engineering leadership, software development, and team building.',
  openGraph: {
    title: 'Blog — Carl M. Lane',
    description: 'Thoughts on engineering leadership, software development, and team building.',
    url: 'https://carlmlane.com/blog',
    type: 'website',
  },
  alternates: { canonical: 'https://carlmlane.com/blog' },
};

const BlogPage = async () => {
  const [posts, tags] = await Promise.all([getBlogPosts(), getAllTags()]);

  return (
    <>
      <BlogSchema posts={posts} />
      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Blog</h1>
        <p className="text-muted">Thoughts on engineering leadership, software development, and team building.</p>
      </header>
      <div className="space-y-8">
        <TagFilter tags={tags} />
        <BlogGrid posts={posts} />
      </div>
    </>
  );
};

export default BlogPage;
