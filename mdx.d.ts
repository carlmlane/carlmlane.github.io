// Augments the ambient `*.mdx` module type (from @next/mdx, which only declares
// the default component export) so statically-imported posts can also expose
// their `metadata` frontmatter export. Validated at runtime via postMetadataSchema.
declare module '*.mdx' {
  export const metadata: unknown;
}
