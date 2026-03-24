import { expect, test } from '@playwright/test';

const hydrationPattern = /hydrat|did not match|server.rendered|text content|#418|#423|#425/i;

const collectErrors = (page: import('@playwright/test').Page): string[] => {
  const errors: string[] = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });
  page.on('pageerror', (err) => {
    errors.push(err.message);
  });
  return errors;
};

test.describe('Hydration', () => {
  test('blog post page hydrates without errors', async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto('/blog/about-me');
    await page.waitForLoadState('networkidle');

    const hydrationErrors = errors.filter((e) => hydrationPattern.test(e));
    expect(hydrationErrors).toEqual([]);
  });

  test('blog index page hydrates without errors', async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto('/blog');
    await page.waitForLoadState('networkidle');

    const hydrationErrors = errors.filter((e) => hydrationPattern.test(e));
    expect(hydrationErrors).toEqual([]);
  });

  test('homepage hydrates without errors', async ({ page }) => {
    const errors = collectErrors(page);

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const hydrationErrors = errors.filter((e) => hydrationPattern.test(e));
    expect(hydrationErrors).toEqual([]);
  });

  test('blog post date is in long format', async ({ page }) => {
    await page.goto('/blog/about-me');
    const timeEl = page.locator('header time');
    await expect(timeEl).toBeVisible();
    const text = await timeEl.textContent();
    expect(text).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
  });

  test('blog card dates are in short format', async ({ page }) => {
    await page.goto('/blog');
    const timeElements = page.locator('article time');
    const count = await timeElements.count();
    expect(count).toBeGreaterThanOrEqual(1);

    for (let i = 0; i < count; i++) {
      const text = await timeElements.nth(i).textContent();
      expect(text).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/);
    }
  });
});
