import { z } from 'zod';
import type { Faq } from './faq';

const postMetadataSchema = z.object({
  title: z.string().min(1),
  date: z.string().date(),
  lastUpdated: z.string().date().optional(),
  description: z.string().min(1),
  tags: z.array(z.string().min(1)),
  published: z.boolean().default(true),
  image: z.string().url().optional(),
  wordCount: z.number().int().positive().optional(),
});

type PostMetadata = z.infer<typeof postMetadataSchema>;

type BlogPost = PostMetadata & {
  readonly slug: string;
  // Computed at build time from the post body (see lib/reading-time.ts).
  readonly readingTimeMinutes?: number;
  // Extracted from the post's <FAQ> block at build time (see lib/faq.ts).
  readonly faqs?: readonly Faq[];
};

export type { BlogPost, PostMetadata };
export { postMetadataSchema };
