import type { Metadata } from 'next';
import { BlogPostingSchema, BreadcrumbSchema } from '@/components/blog/blog-schema';
import PostLayout from '@/components/blog/post-layout';
import slugs from '@/content/blog';
import { formatPostDate, getPostBySlug } from '@/lib/blog';

export const dynamicParams = false;

export const generateStaticParams = () => slugs.map((slug) => ({ slug }));

export const generateMetadata = async ({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> => {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} — Carl M. Lane`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://carlmlane.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      tags: [...post.tags],
    },
    alternates: { canonical: `https://carlmlane.com/blog/${post.slug}` },
  };
};

const BlogPostPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const { default: Content, metadata } = await import(`@/content/blog/${slug}.mdx`);
  const post = await getPostBySlug(slug);

  return (
    <>
      {post && (
        <>
          <BlogPostingSchema post={post} />
          <BreadcrumbSchema
            items={[
              { name: 'Home', url: 'https://carlmlane.com' },
              { name: 'Blog', url: 'https://carlmlane.com/blog' },
              { name: post.title, url: `https://carlmlane.com/blog/${post.slug}` },
            ]}
          />
        </>
      )}
      <PostLayout metadata={metadata} formattedDate={formatPostDate(metadata.date, 'long')}>
        <Content />
      </PostLayout>
    </>
  );
};

export default BlogPostPage;
