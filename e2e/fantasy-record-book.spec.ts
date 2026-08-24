import { expect, test } from '@playwright/test';

const RECORD_BOOK = '/fantasy/nfl/records/sdffl';
const hydrationPattern = /hydrat|did not match|server.rendered|text content|#418|#423|#425/i;

test.describe('SD FFL record book', () => {
  test('hydrates without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto(RECORD_BOOK);
    await page.waitForLoadState('networkidle');

    expect(errors.filter((error) => hydrationPattern.test(error))).toEqual([]);
  });

  test('is marked noindex and excluded from the sitemap', async ({ page }) => {
    await page.goto(RECORD_BOOK);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

    const robots = await (await page.request.get('/robots.txt')).text();
    expect(robots).toContain('Disallow: /fantasy/');

    const sitemap = await (await page.request.get('/sitemap.xml')).text();
    expect(sitemap).not.toContain('/fantasy/');
  });

  test('renders the masthead and every rail section', async ({ page }) => {
    await page.goto(RECORD_BOOK);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('SD FFL Record Book');
    for (const id of ['luck', 'record', 'podium', 'h2h', 'draft', 'roster', 'scoring', 'records', 'seasons']) {
      await expect(page.locator(`section#${id}`)).toBeAttached();
    }
  });

  test('sorts a table by a clicked column', async ({ page }) => {
    await page.goto(RECORD_BOOK);
    const table = page.locator('#record table');
    const ppg = table.getByRole('button', { name: /^PPG/ });

    await ppg.click();
    await expect(table.locator('tbody tr').first().locator('td').nth(5)).toHaveText('114.15');
    await ppg.click();
    await expect(table.locator('tbody tr').first().locator('td').nth(5)).toHaveText('91.82');
  });

  test('swaps a card between its chart and its table', async ({ page }) => {
    await page.goto(RECORD_BOOK);
    const matrixButton = page.getByRole('button', { name: 'Matrix' });
    const tableButton = page.locator('#h2h').getByRole('button', { name: 'Table' });

    await expect(matrixButton).toHaveAttribute('aria-pressed', 'true');
    await tableButton.click();
    await expect(tableButton).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#h2h').getByRole('columnheader', { name: /Opponent/ })).toBeVisible();
  });

  test('shows a tooltip on a matrix cell', async ({ page }) => {
    await page.goto(RECORD_BOOK);
    await page.locator('#h2h td[title]').first().hover();
    await expect(page.getByRole('status')).toContainText('win rate');
  });

  test('changes the standings when another season is picked', async ({ page }) => {
    await page.goto(RECORD_BOOK);
    const standings = page.locator('#seasons table').last();
    const select = page.locator('#seasons select');

    await select.selectOption('2017');
    await expect(standings.locator('tbody tr').first()).toContainText('Thien N.');
    await select.selectOption('2025');
    await expect(standings.locator('tbody tr').first()).not.toContainText('Thien N.');
  });

  test('never scrolls the page sideways on a phone', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(RECORD_BOOK);
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return doc.scrollWidth - doc.clientWidth;
    });
    expect(overflow).toBeLessThanOrEqual(1);
  });
});
