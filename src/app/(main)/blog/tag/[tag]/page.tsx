import type { Metadata } from 'next';
import BlogGrid from '@/components/blog/blog-grid';
import TagFilter from '@/components/blog/tag-filter';
import { getAllTags, getPostsByTag } from '@/lib/blog';

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
};

export const generateMetadata = async ({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> => {
  const { tag } = await params;
  return {
    title: `Posts tagged "${tag}" — Carl M. Lane`,
    description: `Blog posts about ${tag}.`,
    openGraph: {
      title: `Posts tagged "${tag}" — Carl M. Lane`,
      description: `Blog posts about ${tag}.`,
      url: `https://carlmlane.com/blog/tag/${tag}`,
      type: 'website',
    },
    alternates: { canonical: `https://carlmlane.com/blog/tag/${tag}` },
  };
};

const TagPage = async ({ params }: { params: Promise<{ tag: string }> }) => {
  const { tag } = await params;
  const [posts, allTags] = await Promise.all([getPostsByTag(tag), getAllTags()]);

  return (
    <>
      <header className="mb-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Posts tagged &ldquo;{tag}&rdquo;
        </h1>
      </header>
      <div className="space-y-8">
        <TagFilter tags={allTags} activeTag={tag} />
        <BlogGrid posts={posts} />
      </div>
    </>
  );
};

export default TagPage;
