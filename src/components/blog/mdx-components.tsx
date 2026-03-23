import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import { highlight } from 'sugar-high';

const createHeading = (Tag: 'h1' | 'h2' | 'h3' | 'h4') => {
  const Heading = (props: ComponentPropsWithoutRef<typeof Tag>) => (
    <Tag {...props} className="text-foreground font-semibold tracking-tight" />
  );
  Heading.displayName = Tag;
  return Heading;
};

const Anchor = ({ href = '', children, ...props }: ComponentPropsWithoutRef<'a'>) => {
  const isExternal = href.startsWith('http') || href.startsWith('//');
  return (
    <a
      href={href}
      className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-colors"
      {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  );
};

const InlineCode = ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
  const codeHTML = highlight(String(children));
  return (
    <code
      className="rounded bg-surface px-1.5 py-0.5 font-mono text-sm"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: sugar-high produces safe HTML from code strings
      dangerouslySetInnerHTML={{ __html: codeHTML }}
      {...props}
    />
  );
};

const Pre = (props: ComponentPropsWithoutRef<'pre'>) => (
  <pre className="overflow-x-auto rounded-lg bg-surface p-4 font-mono text-sm leading-relaxed" {...props} />
);

const Blockquote = (props: ComponentPropsWithoutRef<'blockquote'>) => (
  <blockquote className="border-l-2 border-accent-warm pl-4 text-muted italic" {...props} />
);

const Img = (props: ComponentPropsWithoutRef<'img'>) => (
  // biome-ignore lint/a11y/useAltText: alt is passed through props from MDX
  // biome-ignore lint/performance/noImgElement: MDX content images don't have static dimensions for next/image
  <img className="rounded-lg" {...props} />
);

const blogMdxComponents: MDXComponents = {
  h1: createHeading('h1'),
  h2: createHeading('h2'),
  h3: createHeading('h3'),
  h4: createHeading('h4'),
  a: Anchor,
  code: InlineCode,
  pre: Pre,
  blockquote: Blockquote,
  img: Img,
};

export { blogMdxComponents };
