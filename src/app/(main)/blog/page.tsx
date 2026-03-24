import type { Metadata } from 'next';
import BlogGrid from '@/components/blog/blog-grid';
import { BlogSchema, BreadcrumbSchema } from '@/components/blog/blog-schema';
import TagFilter from '@/components/blog/tag-filter';
import { formatPostDate, getAllTags, getBlogPosts } from '@/lib/blog';

export const metadata: Metadata = {
  title: 'Engineering Leadership Blog — Carl M. Lane',
  description:
    'Insights on engineering leadership, software development, and building high-performing teams from a VP of Engineering in San Francisco.',
  openGraph: {
    title: 'Engineering Leadership Blog — Carl M. Lane',
    description:
      'Insights on engineering leadership, software development, and building high-performing teams from a VP of Engineering in San Francisco.',
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
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: 'https://carlmlane.com' },
          { name: 'Blog', url: 'https://carlmlane.com/blog' },
        ]}
      />
      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Blog</h1>
        <p className="text-muted">
          Insights on engineering leadership, software development, and building high-performing teams.
        </p>
      </header>
      <div className="space-y-8">
        <TagFilter tags={tags} />
        <BlogGrid posts={posts.map((post) => ({ ...post, formattedDate: formatPostDate(post.date, 'short') }))} />
      </div>
    </>
  );
};

export default BlogPage;
