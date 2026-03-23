import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import BackLink from './back-link';

type MockProps = { children?: React.ReactNode; [key: string]: unknown };

vi.mock('framer-motion', () => ({
  motion: {
    a: ({ children, ...props }: MockProps) => <a {...props}>{children}</a>,
  },
}));

afterEach(cleanup);

describe('BackLink', () => {
  it('renders link to /blog', () => {
    const { getByRole } = render(<BackLink />);
    expect(getByRole('link')).toHaveAttribute('href', '/blog');
  });

  it('renders "Back to blog" text', () => {
    const { getByText } = render(<BackLink />);
    expect(getByText('Back to blog')).toBeInTheDocument();
  });

  it('renders arrow with aria-hidden', () => {
    const { container } = render(<BackLink />);
    const arrow = container.querySelector('[aria-hidden="true"]');
    expect(arrow).toBeInTheDocument();
  });
});
