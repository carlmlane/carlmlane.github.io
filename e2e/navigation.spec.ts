import { expect, test } from '@playwright/test';

test.describe('Cross-page Navigation', () => {
  test('homepage → blog index → post → back to blog', async ({ page }) => {
    await page.goto('/');

    // Navigate to blog via "View all posts" link
    await page.getByRole('link', { name: /view all posts/i }).click();
    await expect(page).toHaveURL(/\/blog\/?$/);
    await expect(page.getByRole('heading', { level: 1, name: 'Blog' })).toBeVisible();

    // Click first blog post
    await page.getByRole('article').first().getByRole('link').click();
    await expect(page).toHaveURL(/\/blog\/.+/);
    await expect(page.locator('.prose')).toBeVisible();

    // Navigate back to blog
    await page.getByRole('link', { name: /back to blog/i }).click();
    await expect(page).toHaveURL(/\/blog\/?$/);
  });

  test('blog index → tag page → blog index', async ({ page }) => {
    await page.goto('/blog');

    // Click a tag in the filter nav
    const nav = page.getByRole('navigation', { name: /filter posts by tag/i });
    const tagLink = nav.getByRole('link').filter({ hasNotText: 'All' }).first();
    const tagHref = await tagLink.getAttribute('href');
    await tagLink.click();
    await expect(page).toHaveURL(new RegExp(`${tagHref?.replace(/\/$/, '')}/?$`));

    // Navigate back via "All"
    const tagNav = page.getByRole('navigation', { name: /filter posts by tag/i });
    await tagNav.getByText('All').click();
    await expect(page).toHaveURL(/\/blog\/?$/);
  });

  test('homepage writing section post links work', async ({ page }) => {
    await page.goto('/');
    const writingSection = page.locator('section', { has: page.getByText('// writing') });
    const postLink = writingSection
      .getByRole('link')
      .filter({ hasNot: page.getByText(/view all posts/i) })
      .first();
    const href = await postLink.getAttribute('href');
    await postLink.click();
    await expect(page).toHaveURL(new RegExp(`${href?.replace(/\/$/, '')}/?$`));
    await expect(page.locator('header h1')).toBeVisible();
  });
});
