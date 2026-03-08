import { AnimatedSection } from './section';

type Post = {
  title: string;
  date: string;
  slug: string;
  description: string;
};

const posts: readonly Post[] = [];

const Writing = () => (
  <AnimatedSection label="// writing">
    {posts.length > 0 ? (
      <div className="space-y-4">
        {posts.map((post) => (
          <a key={post.slug} href={`/writing/${post.slug}`} className="group block space-y-1">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
                {post.title}
              </h3>
              <span className="shrink-0 font-mono text-xs text-muted">{post.date}</span>
            </div>
            <p className="text-sm text-muted">{post.description}</p>
          </a>
        ))}
      </div>
    ) : (
      <p className="text-muted">Coming soon.</p>
    )}
  </AnimatedSection>
);

export default Writing;
