import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TagChip from './tag-chip';

afterEach(cleanup);

describe('TagChip', () => {
  it('renders tag text', () => {
    const { getByText } = render(<TagChip tag="react" />);
    expect(getByText('react')).toBeInTheDocument();
  });

  it('links to tag page when inactive', () => {
    const { getByRole } = render(<TagChip tag="react" />);
    expect(getByRole('link')).toHaveAttribute('href', '/blog/tag/react');
  });

  it('links to /blog when active', () => {
    const { getByRole } = render(<TagChip tag="react" active />);
    expect(getByRole('link')).toHaveAttribute('href', '/blog');
  });
});
