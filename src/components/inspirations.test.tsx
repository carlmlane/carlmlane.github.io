import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import Inspirations from './inspirations';

afterEach(cleanup);

describe('Inspirations', () => {
  it('renders section label', () => {
    const { getByText } = render(<Inspirations />);
    expect(getByText('// inspirations')).toBeInTheDocument();
  });

  it('renders all ten inspirations', () => {
    const { getAllByRole } = render(<Inspirations />);
    const links = getAllByRole('link');
    expect(links).toHaveLength(10);
  });

  it('each link has a title attribute matching the name', () => {
    const { getByRole } = render(<Inspirations />);
    const names = [
      'Marie Curie',
      'Chester Nimitz',
      'Alan Shepard',
      'Gene Kranz',
      'Chuck Yeager',
      'Grace Hopper',
      'Margaret Hamilton',
      'Linus Torvalds',
      'Steve Wozniak',
      'Slavoj Žižek',
    ];
    for (const name of names) {
      const link = getByRole('link', { name });
      expect(link).toHaveAttribute('title', name);
    }
  });

  it('external links have correct rel and target attributes', () => {
    const { getAllByRole } = render(<Inspirations />);
    for (const link of getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('links point to Wikipedia URLs', () => {
    const { getAllByRole } = render(<Inspirations />);
    for (const link of getAllByRole('link')) {
      expect(link.getAttribute('href')).toMatch(/^https:\/\/en\.wikipedia\.org\/wiki\//);
    }
  });
});
