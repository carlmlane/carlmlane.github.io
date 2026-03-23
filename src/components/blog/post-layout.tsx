'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { PostMetadata } from '@/lib/schemas';
import BackLink from './back-link';
import TagChip from './tag-chip';

type PostLayoutProps = {
  readonly metadata: PostMetadata;
  readonly children: ReactNode;
};

const PostLayout = ({ metadata, children }: PostLayoutProps) => (
  <motion.article initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
    <BackLink />
    <header className="mb-10 space-y-4">
      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{metadata.title}</h1>
      <div className="flex flex-wrap items-center gap-4">
        <time dateTime={metadata.date} className="font-mono text-sm text-muted">
          {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' }).format(
            new Date(metadata.date),
          )}
        </time>
        <div className="flex flex-wrap gap-2">
          {metadata.tags.map((tag) => (
            <TagChip key={tag} tag={tag} />
          ))}
        </div>
      </div>
    </header>
    <div className="prose prose-lg max-w-none">{children}</div>
  </motion.article>
);

export default PostLayout;
