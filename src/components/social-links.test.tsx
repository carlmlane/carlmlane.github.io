import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import SocialLinks from './social-links';

afterEach(cleanup);

describe('SocialLinks', () => {
  it('renders GitHub link with correct href', () => {
    const { getByRole } = render(<SocialLinks />);
    const github = getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('href', 'https://github.com/carlmlane');
  });

  it('renders LinkedIn link with correct href', () => {
    const { getByRole } = render(<SocialLinks />);
    const linkedin = getByRole('link', { name: 'LinkedIn' });
    expect(linkedin).toHaveAttribute('href', 'https://linkedin.com/in/carlmlane');
  });

  it('sets target="_blank" and rel="me noopener noreferrer" on external links', () => {
    const { getByRole } = render(<SocialLinks />);

    const github = getByRole('link', { name: 'GitHub' });
    expect(github).toHaveAttribute('target', '_blank');
    expect(github).toHaveAttribute('rel', 'me noopener noreferrer');

    const linkedin = getByRole('link', { name: 'LinkedIn' });
    expect(linkedin).toHaveAttribute('target', '_blank');
    expect(linkedin).toHaveAttribute('rel', 'me noopener noreferrer');
  });

  it('sets title attribute on each link', () => {
    const { getByRole } = render(<SocialLinks />);
    expect(getByRole('link', { name: 'GitHub' })).toHaveAttribute('title', 'GitHub');
    expect(getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('title', 'LinkedIn');
  });

  it('renders correct number of links', () => {
    const { getAllByRole } = render(<SocialLinks />);
    const links = getAllByRole('link');
    expect(links).toHaveLength(2);
  });

  it('each link contains an SVG icon', () => {
    const { getAllByRole } = render(<SocialLinks />);
    const links = getAllByRole('link');
    for (const link of links) {
      expect(link.querySelector('svg')).toBeInTheDocument();
    }
  });
});
