import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('sugar-high', () => ({
  highlight: vi.fn((code: string) => `<span class="highlighted">${code}</span>`),
}));

const { blogMdxComponents } = await import('./mdx-components');

afterEach(cleanup);

describe('blogMdxComponents', () => {
  it('exports all expected component keys', () => {
    expect(Object.keys(blogMdxComponents)).toEqual(
      expect.arrayContaining(['h1', 'h2', 'h3', 'h4', 'a', 'code', 'pre', 'blockquote', 'img']),
    );
  });
});

describe('createHeading', () => {
  it.each(['h1', 'h2', 'h3', 'h4'] as const)('renders %s with correct className', (tag) => {
    const Component = blogMdxComponents[tag] as React.ComponentType<{ children: React.ReactNode }>;
    const { container } = render(<Component>Test heading</Component>);
    const el = container.querySelector(tag);
    expect(el).toBeInTheDocument();
    expect(el?.textContent).toBe('Test heading');
    expect(el?.className).toContain('text-foreground');
  });
});

describe('Anchor', () => {
  const AnchorComponent = blogMdxComponents.a as React.ComponentType<{
    href?: string;
    children: React.ReactNode;
  }>;

  it('renders internal link without target or rel', () => {
    const { getByRole } = render(<AnchorComponent href="/blog/test">Internal</AnchorComponent>);
    const link = getByRole('link');
    expect(link).toHaveAttribute('href', '/blog/test');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
  });

  it('renders external http link with target and rel', () => {
    const { getByRole } = render(<AnchorComponent href="https://example.com">External</AnchorComponent>);
    const link = getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders external // link with target and rel', () => {
    const { getByRole } = render(<AnchorComponent href="//cdn.example.com/file">CDN</AnchorComponent>);
    const link = getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders with empty href when none provided', () => {
    const { container } = render(<AnchorComponent>No href</AnchorComponent>);
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveAttribute('href', '');
    expect(anchor).not.toHaveAttribute('target');
  });
});

describe('InlineCode', () => {
  const CodeComponent = blogMdxComponents.code as React.ComponentType<{ children: React.ReactNode }>;

  it('renders highlighted code', () => {
    const { container } = render(<CodeComponent>const x = 1</CodeComponent>);
    const code = container.querySelector('code');
    expect(code).toBeInTheDocument();
    expect(code?.innerHTML).toContain('highlighted');
  });

  it('has correct className', () => {
    const { container } = render(<CodeComponent>code</CodeComponent>);
    const code = container.querySelector('code');
    expect(code?.className).toContain('font-mono');
  });
});

describe('Pre', () => {
  const PreComponent = blogMdxComponents.pre as React.ComponentType<{ children: React.ReactNode }>;

  it('renders pre with className', () => {
    const { container } = render(<PreComponent>code block</PreComponent>);
    const pre = container.querySelector('pre');
    expect(pre).toBeInTheDocument();
    expect(pre?.className).toContain('overflow-x-auto');
    expect(pre?.textContent).toBe('code block');
  });
});

describe('Blockquote', () => {
  const BlockquoteComponent = blogMdxComponents.blockquote as React.ComponentType<{ children: React.ReactNode }>;

  it('renders blockquote with className', () => {
    const { container } = render(<BlockquoteComponent>A quote</BlockquoteComponent>);
    const bq = container.querySelector('blockquote');
    expect(bq).toBeInTheDocument();
    expect(bq?.className).toContain('border-l-2');
    expect(bq?.textContent).toBe('A quote');
  });
});

describe('Img', () => {
  const ImgComponent = blogMdxComponents.img as React.ComponentType<{ src: string; alt: string }>;

  it('renders img with passed props', () => {
    const { container } = render(<ImgComponent src="/test.png" alt="Test image" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/test.png');
    expect(img).toHaveAttribute('alt', 'Test image');
    expect(img?.className).toContain('rounded-lg');
  });
});
