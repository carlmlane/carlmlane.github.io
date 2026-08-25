import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Page, { metadata } from './page';

afterEach(cleanup);

describe('Four Yard Puma record book page metadata', () => {
  it('keeps the page out of search indexes', () => {
    expect(metadata.robots).toMatchObject({ index: false, follow: false });
    expect(metadata.robots).toMatchObject({ googleBot: { index: false, follow: false } });
  });

  it('publishes no canonical, Open Graph or Twitter card for a private page', () => {
    expect(metadata.alternates?.canonical).toBeNull();
    expect(metadata.openGraph).toBeUndefined();
    expect(metadata.twitter).toBeUndefined();
  });

  it('still titles and describes the page for anyone holding the link', () => {
    expect(metadata.title).toBe('Four Yard Puma Record Book');
    expect(metadata.description).toContain('fantasy football league');
  });
});

describe('Four Yard Puma record book page', () => {
  it('renders the record book', () => {
    const { getByRole } = render(<Page />);
    expect(getByRole('heading', { level: 1 })).toHaveTextContent('Four Yard Puma Record Book');
  });
});
