import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RootLayout, { metadata } from './layout';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: () => null,
}));

afterEach(cleanup);

describe('metadata', () => {
  it('has correct title', () => {
    expect(metadata.title).toBe('Carl M. Lane — VP of Engineering');
  });

  it('has correct description', () => {
    expect(metadata.description).toContain('Engineering leader');
  });

  it('has openGraph configuration', () => {
    expect(metadata.openGraph).toBeDefined();
  });

  it('has twitter card configuration', () => {
    expect(metadata.twitter).toBeDefined();
  });

  it('allows indexing and following', () => {
    expect(metadata.robots).toEqual({ index: true, follow: true });
  });

  it('has keywords', () => {
    expect(metadata.keywords).toBeDefined();
    expect(Array.isArray(metadata.keywords)).toBe(true);
    expect((metadata.keywords as string[]).length).toBeGreaterThan(0);
  });

  it('has canonical URL', () => {
    expect(metadata.alternates?.canonical).toBe('https://carlmlane.com');
  });

  it('has author', () => {
    const authors = metadata.authors as Array<{ name: string; url: string }>;
    expect(authors).toBeDefined();
    expect(authors[0].name).toBe('Carl M. Lane');
    expect(authors[0].url).toBe('https://carlmlane.com');
  });

  it('has publisher', () => {
    expect(metadata.publisher).toBe('Carl M. Lane');
  });
});

describe('RootLayout', () => {
  it('renders children', () => {
    const { getByText } = render(
      <RootLayout>
        <span>test content</span>
      </RootLayout>,
    );
    expect(getByText('test content')).toBeInTheDocument();
  });

  it('includes CSP meta tag with all required directives', () => {
    render(
      <RootLayout>
        <span>child</span>
      </RootLayout>,
    );
    // Head content gets hoisted to document.head by the DOM
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    expect(cspMeta).not.toBeNull();
    const content = cspMeta?.getAttribute('content') ?? '';

    const expectedDirectives = [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      'img-src',
      'connect-src',
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ];

    for (const directive of expectedDirectives) {
      expect(content).toContain(directive);
    }
  });

  it('includes unsafe-eval in script-src outside production', () => {
    render(
      <RootLayout>
        <span>child</span>
      </RootLayout>,
    );
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const content = cspMeta?.getAttribute('content') ?? '';
    // In test environment (NODE_ENV=test, not production), unsafe-eval should be present
    expect(content).toContain("'unsafe-eval'");
  });

  it('includes dns-prefetch and preconnect for GTM', () => {
    render(
      <RootLayout>
        <span>child</span>
      </RootLayout>,
    );
    expect(document.querySelector('link[rel="dns-prefetch"]')).not.toBeNull();
    expect(document.querySelector('link[rel="preconnect"]')).not.toBeNull();
  });
});
