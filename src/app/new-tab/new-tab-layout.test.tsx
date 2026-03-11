import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import NewTabLayout from './layout';
import { NEW_TAB_THEME } from './new-tab-constants';

afterEach(cleanup);

describe('NewTabLayout', () => {
  it('renders children inside the wrapper', () => {
    const { getByText } = render(
      <NewTabLayout>
        <span>test content</span>
      </NewTabLayout>,
    );
    expect(getByText('test content')).toBeInTheDocument();
  });

  it('has a wrapper div with id new-tab-wrapper', () => {
    const { container } = render(
      <NewTabLayout>
        <span>child</span>
      </NewTabLayout>,
    );
    expect(container.querySelector('#new-tab-wrapper')).toBeInTheDocument();
  });

  it('applies light theme inline styles', () => {
    const { container } = render(
      <NewTabLayout>
        <span>child</span>
      </NewTabLayout>,
    );
    const outerDiv = container.firstElementChild as HTMLElement;
    expect(outerDiv.style.backgroundColor).toBe(NEW_TAB_THEME.light.backgroundColor);
    expect(outerDiv.style.color).toBe(NEW_TAB_THEME.light.color);
  });

  it('includes dark mode CSS in a style tag', () => {
    const { container } = render(
      <NewTabLayout>
        <span>child</span>
      </NewTabLayout>,
    );
    const styleTag = container.querySelector('style');
    expect(styleTag?.textContent).toContain('prefers-color-scheme: dark');
    expect(styleTag?.textContent).toContain(NEW_TAB_THEME.dark.backgroundColor);
  });
});
