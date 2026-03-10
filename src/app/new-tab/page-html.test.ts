import { describe, expect, it } from 'vitest';
import {
  NEW_TAB_BODY_ID,
  NEW_TAB_COLOR_SCHEME,
  NEW_TAB_FAVICON,
  NEW_TAB_THEME,
  NEW_TAB_TITLE,
  TRANSPARENT_GIF,
} from './new-tab-constants';
import { buildNewTabHtml } from './page-html';

describe('buildNewTabHtml', () => {
  const html = buildNewTabHtml();

  it('starts with doctype declaration', () => {
    expect(html).toMatch(/^<!doctype html>/);
  });

  it('includes the page title', () => {
    expect(html).toContain(`<title>${NEW_TAB_TITLE}</title>`);
  });

  it('includes the favicon', () => {
    expect(html).toContain(`href="${NEW_TAB_FAVICON}"`);
  });

  it('includes the color-scheme meta tag', () => {
    expect(html).toContain(`content="${NEW_TAB_COLOR_SCHEME}"`);
  });

  it('includes the body ID', () => {
    expect(html).toContain(`id="${NEW_TAB_BODY_ID}"`);
  });

  it('includes the transparent GIF for Chrome rendering', () => {
    expect(html).toContain(TRANSPARENT_GIF);
  });

  it('includes light theme styles', () => {
    expect(html).toContain(`background-color: ${NEW_TAB_THEME.light.backgroundColor}`);
    expect(html).toContain(`color: ${NEW_TAB_THEME.light.color}`);
  });

  it('includes dark theme styles in a prefers-color-scheme media query', () => {
    expect(html).toContain('@media (prefers-color-scheme: dark)');
    expect(html).toContain(`background-color: ${NEW_TAB_THEME.dark.backgroundColor}`);
    expect(html).toContain(`color: ${NEW_TAB_THEME.dark.color}`);
  });

  it('includes service worker registration script', () => {
    expect(html).toContain('navigator.serviceWorker.register("./service-worker.js")');
  });
});
