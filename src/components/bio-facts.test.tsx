import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import BioFacts from './bio-facts';

afterEach(cleanup);

describe('BioFacts', () => {
  it('renders section label', () => {
    const { getByText } = render(<BioFacts />);
    expect(getByText('// at a glance')).toBeInTheDocument();
  });

  it('renders all seven facts', () => {
    const { getByText } = render(<BioFacts />);
    expect(getByText(/Born in the Bay Area/)).toBeInTheDocument();
    expect(getByText(/Lived in Madrid/)).toBeInTheDocument();
    expect(getByText(/dreamed about spaceflight/)).toBeInTheDocument();
    expect(getByText(/aerospace engineering/)).toBeInTheDocument();
    expect(getByText(/Using computers since 1990/)).toBeInTheDocument();
    expect(getByText(/Spent over a decade at/)).toBeInTheDocument();
    expect(getByText(/VP of Engineering/)).toBeInTheDocument();
  });

  it('renders facts with em-dash prefix', () => {
    const { container } = render(<BioFacts />);
    const dashes = container.querySelectorAll('span.text-accent\\/60');
    expect(dashes).toHaveLength(7);
  });

  it('renders Wix link with correct href and title', () => {
    const { getByRole } = render(<BioFacts />);
    const wixLink = getByRole('link', { name: 'Wix.com' });
    expect(wixLink).toHaveAttribute('href', 'https://www.wix.com');
    expect(wixLink).toHaveAttribute('target', '_blank');
    expect(wixLink).toHaveAttribute('title', 'Wix.com');
  });

  it('renders Marqii link with correct href and title', () => {
    const { getByRole } = render(<BioFacts />);
    const marqiiLink = getByRole('link', { name: 'Marqii' });
    expect(marqiiLink).toHaveAttribute('href', 'https://www.marqii.com');
    expect(marqiiLink).toHaveAttribute('target', '_blank');
    expect(marqiiLink).toHaveAttribute('title', 'Marqii');
  });
});
