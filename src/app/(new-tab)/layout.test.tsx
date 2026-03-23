import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import NewTabRootLayout from './layout';
import { NEW_TAB_BODY_ID, NEW_TAB_THEME } from './new-tab/new-tab-constants';

afterEach(cleanup);

describe('NewTabRootLayout', () => {
  it('renders children', () => {
    const { getByText } = render(
      <NewTabRootLayout>
        <span>test content</span>
      </NewTabRootLayout>,
    );
    expect(getByText('test content')).toBeInTheDocument();
  });

  it('sets body id to vimium new tab page id', () => {
    render(
      <NewTabRootLayout>
        <span>child</span>
      </NewTabRootLayout>,
    );
    expect(document.body.id).toBe(NEW_TAB_BODY_ID);
  });

  it('applies light theme inline styles to body', () => {
    render(
      <NewTabRootLayout>
        <span>child</span>
      </NewTabRootLayout>,
    );
    expect(document.body.style.backgroundColor).toBe(NEW_TAB_THEME.light.backgroundColor);
    expect(document.body.style.color).toBe(NEW_TAB_THEME.light.color);
  });

  it('includes dark mode CSS in a style tag', () => {
    const { container } = render(
      <NewTabRootLayout>
        <span>child</span>
      </NewTabRootLayout>,
    );
    const styleTag = container.querySelector('style');
    expect(styleTag?.textContent).toContain('prefers-color-scheme: dark');
    expect(styleTag?.textContent).toContain(NEW_TAB_THEME.dark.backgroundColor);
    expect(styleTag?.textContent).toContain(NEW_TAB_THEME.dark.color);
  });

  it('does not include any class names from the main site', () => {
    const { container } = render(
      <NewTabRootLayout>
        <span>child</span>
      </NewTabRootLayout>,
    );
    const html = container.innerHTML;
    expect(html).not.toContain('geist');
    expect(html).not.toContain('antialiased');
    expect(html).not.toContain('googletagmanager');
  });
});
