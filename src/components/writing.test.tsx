import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Writing from './writing';

afterEach(cleanup);

describe('Writing', () => {
  it('renders section label', () => {
    const { getByText } = render(<Writing />);
    expect(getByText('// writing')).toBeInTheDocument();
  });

  it('renders "Coming soon." when posts array is empty', () => {
    const { getByText } = render(<Writing />);
    expect(getByText('Coming soon.')).toBeInTheDocument();
  });

  it('does not render any post links', () => {
    const { queryAllByRole } = render(<Writing />);
    const links = queryAllByRole('link');
    expect(links).toHaveLength(0);
  });
});
