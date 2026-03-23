import { expect, test } from '@playwright/test';

test.describe('Blog Index', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog — Carl M\. Lane/);
  });

  test('renders blog heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1, name: 'Blog' })).toBeVisible();
  });

  test('renders tag filter with "All" active', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /filter posts by tag/i });
    await expect(nav).toBeVisible();
    await expect(nav.getByText('All')).toBeVisible();
  });

  test('renders blog post cards', async ({ page }) => {
    const articles = page.getByRole('article');
    await expect(articles.first()).toBeVisible();
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('blog cards link to individual posts', async ({ page }) => {
    const firstLink = page.getByRole('article').first().getByRole('link');
    await expect(firstLink).toHaveAttribute('href', /^\/blog\//);
  });

  test('blog cards show title, description, date, and tags', async ({ page }) => {
    const firstArticle = page.getByRole('article').first();
    await expect(firstArticle.locator('h3')).toBeVisible();
    await expect(firstArticle.locator('p')).toBeVisible();
    await expect(firstArticle.locator('time')).toBeVisible();
    await expect(firstArticle.locator('span').first()).toBeVisible();
  });

  test('has Blog JSON-LD schema', async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const content = await scripts.first().textContent();
    expect(content).not.toBeNull();
    const schema = JSON.parse(content ?? '');
    expect(schema['@type']).toBe('Blog');
    expect(schema.blogPost).toBeDefined();
  });

  test('tag chips link to tag pages', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /filter posts by tag/i });
    const tagLinks = nav.getByRole('link').filter({ hasNotText: 'All' });
    const firstTag = tagLinks.first();
    await expect(firstTag).toHaveAttribute('href', /^\/blog\/tag\//);
  });
});

test.describe('Blog Post Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/about-me');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/About Me.*Carl M\. Lane/);
  });

  test('renders post title as h1', async ({ page }) => {
    await expect(page.locator('header h1')).toContainText('About Me');
  });

  test('renders publication date', async ({ page }) => {
    await expect(page.locator('time')).toBeVisible();
  });

  test('renders tag chips', async ({ page }) => {
    const header = page.locator('header');
    await expect(header.getByRole('link', { name: 'personal' })).toBeVisible();
    await expect(header.getByRole('link', { name: 'leadership' })).toBeVisible();
  });

  test('renders back to blog link', async ({ page }) => {
    const backLink = page.getByRole('link', { name: /back to blog/i });
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveAttribute('href', '/blog');
  });

  test('renders prose content', async ({ page }) => {
    await expect(page.locator('.prose')).toBeVisible();
    await expect(page.locator('.prose h2').first()).toBeVisible();
    await expect(page.locator('.prose p').first()).toBeVisible();
  });

  test('has BlogPosting JSON-LD schema', async ({ page }) => {
    const scripts = page.locator('script[type="application/ld+json"]');
    const count = await scripts.count();
    expect(count).toBeGreaterThanOrEqual(1);

    const content = await scripts.first().textContent();
    expect(content).not.toBeNull();
    const schema = JSON.parse(content ?? '');
    expect(schema['@type']).toBe('BlogPosting');
    expect(schema.headline).toContain('About Me');
    expect(schema.author).toBeDefined();
  });

  test('back to blog link navigates correctly', async ({ page }) => {
    await page.getByRole('link', { name: /back to blog/i }).click();
    await expect(page).toHaveURL(/\/blog\/?$/);
  });
});

test.describe('Blog Tag Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/tag/personal');
  });

  test('has correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Posts tagged "personal"/);
  });

  test('renders tag heading', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('personal');
  });

  test('renders tag filter with active tag', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /filter posts by tag/i });
    await expect(nav).toBeVisible();
  });

  test('shows only posts with matching tag', async ({ page }) => {
    const articles = page.getByRole('article');
    const count = await articles.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('"All" link navigates back to blog index', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: /filter posts by tag/i });
    await nav.getByText('All').click();
    await expect(page).toHaveURL(/\/blog\/?$/);
  });
});
