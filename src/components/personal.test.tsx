import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Personal from './personal';

afterEach(cleanup);

describe('Personal', () => {
  it('renders section label', () => {
    const { getByText } = render(<Personal />);
    expect(getByText('// elsewhere')).toBeInTheDocument();
  });

  it('renders personal description', () => {
    const { getByText } = render(<Personal />);
    expect(getByText(/San Francisco/)).toBeInTheDocument();
    expect(getByText(/Aerospace engineering/)).toBeInTheDocument();
  });
});
