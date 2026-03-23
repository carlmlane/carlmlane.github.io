import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Carl M\. Lane/);
  });

  test('renders hero heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Carl M. Lane' })).toBeVisible();
  });

  test('renders VP subtitle', async ({ page }) => {
    await expect(page.getByText('VP of Engineering & Product Development')).toBeVisible();
  });

  test('renders all main sections', async ({ page }) => {
    await expect(page.getByText('// at a glance')).toBeVisible();
    await expect(page.getByText('// writing')).toBeVisible();
    await expect(page.getByText('// philosophy')).toBeVisible();
    await expect(page.getByText('// inspirations')).toBeVisible();
    await expect(page.getByText('// elsewhere')).toBeVisible();
  });

  test('renders social links in hero and footer', async ({ page }) => {
    const githubLinks = page.getByRole('link', { name: /github/i });
    const linkedinLinks = page.getByRole('link', { name: /linkedin/i });
    // Hero + footer both have social links
    await expect(githubLinks.first()).toBeVisible();
    await expect(linkedinLinks.first()).toBeVisible();
    expect(await githubLinks.count()).toBe(2);
  });

  test('writing section links to blog', async ({ page }) => {
    const viewAll = page.getByRole('link', { name: /view all posts/i });
    await expect(viewAll).toBeVisible();
    await expect(viewAll).toHaveAttribute('href', '/blog');
  });

  test('writing section shows recent blog posts', async ({ page }) => {
    const writingSection = page.locator('section', { has: page.getByText('// writing') });
    const postLinks = writingSection.getByRole('link').filter({ hasNot: page.getByText(/view all posts/i) });
    await expect(postLinks.first()).toBeVisible();
  });

  test('renders footer with copyright', async ({ page }) => {
    const year = new Date().getFullYear().toString();
    await expect(page.getByText(new RegExp(`© ${year} Carl M. Lane`))).toBeVisible();
  });

  test('has JSON-LD structured data', async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThan(0);

    const content = await scripts.first().textContent();
    const schema = JSON.parse(content!);
    expect(schema['@context']).toBe('https://schema.org');
  });
});
