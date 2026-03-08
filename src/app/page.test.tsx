import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Home from './page';

afterEach(cleanup);

describe('Home', () => {
  it('renders hero section', () => {
    const { getByRole } = render(<Home />);
    expect(getByRole('heading', { level: 1, name: 'Carl M. Lane' })).toBeInTheDocument();
  });

  it('renders beliefs section', () => {
    const { getByText } = render(<Home />);
    expect(getByText('// philosophy')).toBeInTheDocument();
  });

  it('renders writing section', () => {
    const { getByText } = render(<Home />);
    expect(getByText('// writing')).toBeInTheDocument();
  });

  it('renders personal section', () => {
    const { getByText } = render(<Home />);
    expect(getByText('// elsewhere')).toBeInTheDocument();
  });

  it('renders copyright footer with current year', () => {
    const { getByText } = render(<Home />);
    const year = new Date().getFullYear().toString();
    expect(getByText(new RegExp(`© ${year} Carl M. Lane`))).toBeInTheDocument();
  });

  it('renders a footer element', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
