import { cleanup, render } from '@testing-library/react';
import { act } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import DeferredGoogleTagManager from './deferred-google-tag-manager';

vi.mock('@next/third-parties/google', () => ({
  GoogleTagManager: ({ gtmId }: { gtmId: string }) => <div data-testid="gtm">{gtmId}</div>,
}));

afterEach(cleanup);

describe('DeferredGoogleTagManager', () => {
  it('does not load GTM on initial render', () => {
    const { queryByTestId } = render(<DeferredGoogleTagManager gtmId="GTM-TEST" />);
    expect(queryByTestId('gtm')).toBeNull();
  });

  it('loads GTM after the first user interaction', async () => {
    const { queryByTestId } = render(<DeferredGoogleTagManager gtmId="GTM-TEST" />);
    expect(queryByTestId('gtm')).toBeNull();

    await act(async () => {
      window.dispatchEvent(new Event('pointerdown'));
    });

    expect(queryByTestId('gtm')).toHaveTextContent('GTM-TEST');
  });
});
