import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Footer from './footer';

afterEach(cleanup);

describe('Footer', () => {
  it('renders a footer element', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  it('renders the current year in the copyright', () => {
    const { getByText } = render(<Footer />);
    expect(getByText(new RegExp(`${new Date().getFullYear()} Carl M. Lane`))).toBeInTheDocument();
  });

  it('links to the primary pages including now and uses', () => {
    const { getByRole } = render(<Footer />);
    const nav = getByRole('navigation', { name: 'Footer' });
    for (const href of ['/', '/about', '/blog', '/now', '/uses']) {
      expect(nav.querySelector(`a[href="${href}"]`)).toBeInTheDocument();
    }
  });
});
