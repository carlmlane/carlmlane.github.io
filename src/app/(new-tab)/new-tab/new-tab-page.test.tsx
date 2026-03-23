import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { TRANSPARENT_GIF } from './new-tab-constants';
import NewTabPage from './page';

afterEach(cleanup);

describe('NewTabPage', () => {
  it('renders a transparent GIF image', () => {
    const { container } = render(<NewTabPage />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img?.getAttribute('src')).toBe(TRANSPARENT_GIF);
  });

  it('renders an img with empty alt text for accessibility', () => {
    const { container } = render(<NewTabPage />);
    const img = container.querySelector('img');
    expect(img?.getAttribute('alt')).toBe('');
  });
});
