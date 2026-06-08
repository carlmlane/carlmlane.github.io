import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./redirect-to-about', () => ({ default: () => null }));

const { default: AboutMeRedirect, metadata } = await import('./page');

afterEach(cleanup);

describe('about-me redirect stub', () => {
  it('canonicalizes to /about so ranking signals consolidate', () => {
    expect(metadata.alternates?.canonical).toBe('https://carlmlane.com/about');
  });

  it('renders a visible link to /about', () => {
    const { getByRole } = render(<AboutMeRedirect />);
    expect(getByRole('link')).toHaveAttribute('href', '/about');
  });
});
