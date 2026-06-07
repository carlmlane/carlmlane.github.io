import FormattedDate from '@/components/formatted-date';
import type { BlogPost } from '@/lib/schemas';

type BlogCardProps = {
  readonly post: BlogPost;
  readonly index: number;
};

const BlogCard = ({ post, index }: BlogCardProps) => (
  <article className="group animate-fade-in-up" style={{ animationDelay: `${index * 80}ms` }}>
    <a
      href={`/blog/${post.slug}`}
      className="block rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-[0_0_20px_var(--accent-glow)]"
    >
      <div className="space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-semibold text-foreground transition-colors group-hover:text-accent">{post.title}</h3>
          <FormattedDate dateStr={post.date} style="short" className="shrink-0 font-mono text-xs text-muted" />
        </div>
        <p className="text-sm leading-relaxed text-muted">{post.description}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-subtle px-2.5 py-0.5 font-mono text-xs text-muted">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  </article>
);

export default BlogCard;
