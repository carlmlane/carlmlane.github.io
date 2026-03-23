import { getRecentPosts } from '@/lib/blog';
import { AnimatedSection } from './section';

const Writing = async () => {
  const posts = await getRecentPosts(3);

  return (
    <AnimatedSection label="// writing">
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <a key={post.slug} href={`/blog/${post.slug}`} title={post.title} className="group block space-y-1">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-medium text-foreground transition-colors duration-200 group-hover:text-accent">
                  {post.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    timeZone: 'UTC',
                  }).format(new Date(post.date))}
                </span>
              </div>
              <p className="text-sm text-muted">{post.description}</p>
            </a>
          ))}
          <a
            href="/blog"
            className="inline-block font-mono text-sm text-accent hover:text-accent-hover transition-colors"
          >
            View all posts &rarr;
          </a>
        </div>
      ) : (
        <p className="text-muted">Coming soon.</p>
      )}
    </AnimatedSection>
  );
};

export default Writing;
