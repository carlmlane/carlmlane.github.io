const BackLink = () => (
  <a
    href="/blog"
    className="group mb-8 inline-flex animate-fade-in items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-accent"
  >
    <span className="transition-transform group-hover:-translate-x-1" aria-hidden="true">
      &larr;
    </span>
    Back to blog
  </a>
);

export default BackLink;
