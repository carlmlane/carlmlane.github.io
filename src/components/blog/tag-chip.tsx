type TagChipProps = {
  readonly tag: string;
  readonly active?: boolean;
};

const TagChip = ({ tag, active = false }: TagChipProps) => (
  <a
    href={active ? '/blog' : `/blog/tag/${tag}`}
    className={`inline-block rounded-full px-3 py-1 font-mono text-xs transition-colors ${
      active ? 'bg-accent text-background' : 'bg-subtle text-muted hover:text-accent hover:bg-surface'
    }`}
  >
    {tag}
  </a>
);

export default TagChip;
