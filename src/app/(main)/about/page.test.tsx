import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/content/about.mdx', () => ({
  default: () => <div data-testid="about-content">About body content.</div>,
  metadata: {
    title: 'Support Rep to VP: An Unconventional Path',
    date: '2026-03-22',
    lastUpdated: '2026-03-23',
    description: 'A path from support to VP of Engineering.',
    tags: ['career', 'leadership'],
    published: true,
    image: 'https://carlmlane.com/blog/about-me/hero.jpg',
  },
}));

const { default: About, metadata } = await import('./page');

afterEach(cleanup);

const getSchemas = (container: HTMLElement) =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].map((script) =>
    JSON.parse(script.textContent ?? '{}'),
  );

describe('About page metadata', () => {
  it('canonicalizes to /about', () => {
    expect(metadata.alternates?.canonical).toBe('https://carlmlane.com/about');
  });

  it('uses the frontmatter description', () => {
    expect(metadata.description).toBe('A path from support to VP of Engineering.');
  });

  it('exposes the hero image to Open Graph', () => {
    const og = metadata.openGraph as Record<string, unknown>;
    expect(og.images).toEqual([{ url: 'https://carlmlane.com/blog/about-me/hero.jpg' }]);
  });
});

describe('About page', () => {
  it('renders the title as an h1', () => {
    const { getByRole } = render(<About />);
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Support Rep to VP');
  });

  it('renders the MDX content', () => {
    const { getByTestId } = render(<About />);
    expect(getByTestId('about-content')).toBeInTheDocument();
  });

  it('emits AboutPage JSON-LD referencing the canonical person @id', () => {
    const { container } = render(<About />);
    const about = getSchemas(container).find((s) => s['@type'] === 'AboutPage');
    expect(about).toBeDefined();
    expect(about.url).toBe('https://carlmlane.com/about');
    expect(about.mainEntity).toEqual({ '@id': 'https://carlmlane.com/#person' });
  });

  it('emits a Home > About breadcrumb', () => {
    const { container } = render(<About />);
    const breadcrumb = getSchemas(container).find((s) => s['@type'] === 'BreadcrumbList');
    expect(breadcrumb.itemListElement).toHaveLength(2);
    expect(breadcrumb.itemListElement[1]).toMatchObject({ name: 'About', item: 'https://carlmlane.com/about' });
  });
});
