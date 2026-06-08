import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Uses, { metadata } from './page';

afterEach(cleanup);

describe('Uses page metadata', () => {
  it('canonicalizes to /uses', () => {
    expect(metadata.alternates?.canonical).toBe('https://carlmlane.com/uses');
  });

  it('has a descriptive title', () => {
    expect(metadata.title).toContain('Uses');
  });
});

describe('Uses page', () => {
  it('renders the heading', () => {
    const { getByRole } = render(<Uses />);
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Uses');
  });

  it('renders grouped sections', () => {
    const { container } = render(<Uses />);
    expect(container.querySelectorAll('h2').length).toBeGreaterThanOrEqual(3);
  });

  it('links out to a known tool with safe rel attributes', () => {
    const { getByRole } = render(<Uses />);
    const link = getByRole('link', { name: 'Next.js' });
    expect(link).toHaveAttribute('href', 'https://nextjs.org');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders the footer', () => {
    const { container } = render(<Uses />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
