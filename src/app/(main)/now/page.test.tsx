import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Now, { metadata } from './page';

afterEach(cleanup);

describe('Now page metadata', () => {
  it('canonicalizes to /now', () => {
    expect(metadata.alternates?.canonical).toBe('https://carlmlane.com/now');
  });

  it('has a descriptive title', () => {
    expect(metadata.title).toContain('Now');
  });
});

describe('Now page', () => {
  it('renders the heading', () => {
    const { getByRole } = render(<Now />);
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Now');
  });

  it('shows a last-updated date', () => {
    const { container } = render(<Now />);
    expect(container.querySelector('time')).toBeInTheDocument();
  });

  it('renders the focus sections', () => {
    const { container } = render(<Now />);
    expect(container.querySelectorAll('h2').length).toBeGreaterThanOrEqual(3);
  });

  it('renders the footer', () => {
    const { container } = render(<Now />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
