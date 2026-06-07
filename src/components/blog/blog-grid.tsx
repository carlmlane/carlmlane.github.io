import type { BlogPost } from '@/lib/schemas';
import BlogCard from './blog-card';

type BlogGridProps = {
  readonly posts: readonly BlogPost[];
};

const BlogGrid = ({ posts }: BlogGridProps) =>
  posts.length > 0 ? (
    <div className="grid grid-cols-1 gap-4">
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} />
      ))}
    </div>
  ) : (
    <p className="text-muted">No posts found.</p>
  );

export default BlogGrid;
