import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, type Mock, vi } from 'vitest';
import NavLink from './nav-link';

const mockUsePathname = vi.fn() as Mock<() => string>;

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

afterEach(cleanup);

describe('NavLink', () => {
  it('renders a link with correct href and text', () => {
    mockUsePathname.mockReturnValue('/');
    const { getByRole } = render(
      <NavLink href="/" exact>
        Home
      </NavLink>,
    );
    const link = getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('href', '/');
  });

  it('applies active styling and aria-current on exact match', () => {
    mockUsePathname.mockReturnValue('/');
    const { getByRole } = render(
      <NavLink href="/" exact>
        Home
      </NavLink>,
    );
    const link = getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link.className).toContain('text-accent');
  });

  it('applies inactive styling when pathname does not match', () => {
    mockUsePathname.mockReturnValue('/blog');
    const { getByRole } = render(
      <NavLink href="/" exact>
        Home
      </NavLink>,
    );
    const link = getByRole('link', { name: 'Home' });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link.className).toContain('text-muted');
  });

  it('matches prefix for blog routes', () => {
    mockUsePathname.mockReturnValue('/blog/some-slug');
    const { getByRole } = render(<NavLink href="/blog">Blog</NavLink>);
    const link = getByRole('link', { name: 'Blog' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link.className).toContain('text-accent');
  });

  it('blog link is inactive on home page', () => {
    mockUsePathname.mockReturnValue('/');
    const { getByRole } = render(<NavLink href="/blog">Blog</NavLink>);
    const link = getByRole('link', { name: 'Blog' });
    expect(link).not.toHaveAttribute('aria-current');
    expect(link.className).toContain('text-muted');
  });
});
