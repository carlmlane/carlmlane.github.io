import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Beliefs from './beliefs';

afterEach(cleanup);

describe('Beliefs', () => {
  it('renders section label', () => {
    const { getByText } = render(<Beliefs />);
    expect(getByText('// philosophy')).toBeInTheDocument();
  });

  it('renders blockquote', () => {
    const { container } = render(<Beliefs />);
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveTextContent(/customer obsessed teams/);
  });

  it('renders all four beliefs', () => {
    const { getByText } = render(<Beliefs />);
    expect(getByText(/Small, high-IQ teams/)).toBeInTheDocument();
    expect(getByText(/Engineering is a business lever/)).toBeInTheDocument();
    expect(getByText(/Speed is the only sustainable/)).toBeInTheDocument();
    expect(getByText(/Sincere enthusiasm is contagious/)).toBeInTheDocument();
  });

  it('renders beliefs with em-dash prefix', () => {
    const { container } = render(<Beliefs />);
    const dashes = container.querySelectorAll('span.text-accent\\/60');
    expect(dashes).toHaveLength(4);
  });
});
