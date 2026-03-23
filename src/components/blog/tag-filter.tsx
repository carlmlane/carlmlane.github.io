import TagChip from './tag-chip';

type TagFilterProps = {
  readonly tags: readonly string[];
  readonly activeTag?: string;
};

const TagFilter = ({ tags, activeTag }: TagFilterProps) => (
  <nav aria-label="Filter posts by tag" className="flex flex-wrap gap-2">
    <a
      href="/blog"
      className={`inline-block rounded-full px-3 py-1 font-mono text-xs transition-colors ${
        !activeTag ? 'bg-accent text-background' : 'bg-subtle text-muted hover:text-accent hover:bg-surface'
      }`}
    >
      All
    </a>
    {tags.map((tag) => (
      <TagChip key={tag} tag={tag} active={tag === activeTag} />
    ))}
  </nav>
);

export default TagFilter;
