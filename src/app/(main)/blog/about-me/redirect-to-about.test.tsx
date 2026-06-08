import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import RedirectToAbout from './redirect-to-about';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RedirectToAbout', () => {
  it('replaces the current location with /about on mount', () => {
    const replace = vi.fn();
    vi.stubGlobal('location', { replace });
    render(<RedirectToAbout />);
    expect(replace).toHaveBeenCalledWith('/about');
  });

  it('renders nothing', () => {
    vi.stubGlobal('location', { replace: vi.fn() });
    const { container } = render(<RedirectToAbout />);
    expect(container).toBeEmptyDOMElement();
  });
});
