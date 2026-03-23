import { expect, test } from '@playwright/test';

test.describe('SEO & Accessibility', () => {
  test('homepage has proper meta tags', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /engineering leader/i);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Carl M\. Lane/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /carlmlane\.com/);
  });

  test('blog index has proper meta tags', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /engineering leadership/i);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Blog/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /carlmlane\.com\/blog/);
  });

  test('blog post has article meta tags', async ({ page }) => {
    await page.goto('/blog/about-me');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /Hello, World/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', /carlmlane\.com\/blog\/about-me/);
  });

  test('all pages have lang attribute', async ({ page }) => {
    for (const path of ['/', '/blog', '/blog/about-me']) {
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    }
  });

  test('blog post has semantic article structure', async ({ page }) => {
    await page.goto('/blog/about-me');
    await expect(page.locator('article')).toBeVisible();
    await expect(page.locator('article header h1')).toBeVisible();
    await expect(page.locator('article time')).toBeVisible();
  });

  test('tag filter has accessible navigation', async ({ page }) => {
    await page.goto('/blog');
    const nav = page.getByRole('navigation', { name: /filter posts by tag/i });
    await expect(nav).toBeVisible();
  });

  test('sitemap.xml is served', async ({ page }) => {
    const response = await page.goto('/sitemap.xml');
    expect(response?.status()).toBe(200);
    const text = await response?.text();
    expect(text).toContain('carlmlane.com');
    expect(text).toContain('/blog');
  });

  test('robots.txt is served', async ({ page }) => {
    const response = await page.goto('/robots.txt');
    expect(response?.status()).toBe(200);
  });
});
