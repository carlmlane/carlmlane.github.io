import type { Metadata } from 'next';
import BlogGrid from '@/components/blog/blog-grid';
import TagFilter from '@/components/blog/tag-filter';
import { formatPostDate, getAllTags, getPostsByTag } from '@/lib/blog';

export const dynamicParams = false;

export const generateStaticParams = async () => {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
};

const tagDescriptions: Record<string, string> = {
  career:
    'Articles on career growth, navigating unconventional paths in tech, and lessons learned moving from individual contributor to engineering leadership.',
  engineering:
    'Posts on software engineering practices, architecture decisions, developer experience, and building reliable systems at scale.',
  personal:
    'Personal reflections on the intersection of life and work, continuous learning, and what shapes an engineering leader beyond the codebase.',
  leadership:
    'Thoughts on engineering leadership, building high-performing teams, fostering learning cultures, and scaling organizations effectively.',
};

const getTagDescription = (tag: string): string =>
  tagDescriptions[tag] ??
  `Articles and insights about ${tag} from Carl M. Lane, VP of Engineering. Explore thoughts on engineering leadership and software development.`;

export const generateMetadata = async ({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> => {
  const { tag } = await params;
  const description = getTagDescription(tag);
  return {
    title: `Posts tagged "${tag}" — Carl M. Lane`,
    description,
    openGraph: {
      title: `Posts tagged "${tag}" — Carl M. Lane`,
      description,
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
        <BlogGrid posts={posts.map((post) => ({ ...post, formattedDate: formatPostDate(post.date, 'short') }))} />
      </div>
    </>
  );
};

export default TagPage;
