import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Header from './header';

vi.mock('next/link', () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('./nav-link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href}>{children}</a>,
}));

afterEach(cleanup);

describe('Header', () => {
  it('renders a header element', () => {
    const { container } = render(<Header />);
    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('renders the name', () => {
    const { getByText } = render(<Header />);
    expect(getByText('Carl M. Lane')).toBeInTheDocument();
  });

  it('renders the title', () => {
    const { getByText } = render(<Header />);
    expect(getByText(/VP of Engineering/)).toBeInTheDocument();
  });

  it('has nav with correct aria-label', () => {
    const { getByRole } = render(<Header />);
    expect(getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument();
  });

  it('name links to home', () => {
    const { getByText } = render(<Header />);
    const nameLink = getByText('Carl M. Lane').closest('a');
    expect(nameLink).toHaveAttribute('href', '/');
  });

  it('contains Home and Blog navigation links', () => {
    const { getByRole } = render(<Header />);
    const nav = getByRole('navigation');
    expect(nav.querySelector('a[href="/"]')).toBeInTheDocument();
    expect(nav.querySelector('a[href="/blog"]')).toBeInTheDocument();
  });
});
