import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Hero from './hero';

afterEach(cleanup);

describe('Hero', () => {
  it('renders name in an h1', () => {
    const { getByRole } = render(<Hero />);
    const heading = getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Carl M. Lane');
  });

  it('renders title', () => {
    const { getByText } = render(<Hero />);
    expect(getByText('VP of Engineering & Product Development')).toBeInTheDocument();
  });

  it('renders Marqii link with correct attributes', () => {
    const { getByRole } = render(<Hero />);
    const link = getByRole('link', { name: /marqii/i });
    expect(link).toHaveAttribute('href', 'https://www.marqii.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders description text', () => {
    const { getByText } = render(<Hero />);
    expect(getByText(/learning velocity over perfection/)).toBeInTheDocument();
  });

  it('renders social links', () => {
    const { getByRole } = render(<Hero />);
    expect(getByRole('link', { name: 'GitHub' })).toBeInTheDocument();
    expect(getByRole('link', { name: 'LinkedIn' })).toBeInTheDocument();
  });
});
