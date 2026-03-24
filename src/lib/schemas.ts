import { z } from 'zod';

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
};

export type { BlogPost, PostMetadata };
export { postMetadataSchema };
