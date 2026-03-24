'use client';

import { motion } from 'framer-motion';
import type { BlogPost } from '@/lib/schemas';
import BlogCard from './blog-card';

type BlogPostWithFormattedDate = BlogPost & { readonly formattedDate: string };

type BlogGridProps = {
  readonly posts: readonly BlogPostWithFormattedDate[];
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const BlogGrid = ({ posts }: BlogGridProps) =>
  posts.length > 0 ? (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 gap-4">
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} formattedDate={post.formattedDate} index={index} />
      ))}
    </motion.div>
  ) : (
    <p className="text-muted">No posts found.</p>
  );

export default BlogGrid;
