import { expect, test } from '@playwright/test';

const hydrationPattern = /hydrat|did not match|server.rendered|text content|#418|#423|#425/i;

const SECTION_IDS = ['luck', 'record', 'podium', 'h2h', 'draft', 'roster', 'scoring', 'records', 'seasons'];

type League = {
  readonly name: string;
  readonly path: string;
  readonly heading: string;
  /** Highest and lowest career points per game, which the PPG column sorts between. */
  readonly ppgHigh: string;
  readonly ppgLow: string;
  /** An older season and the manager who finished first in it. */
  readonly olderSeason: string;
  readonly olderChampion: string;
  readonly latestSeason: string;
};

const LEAGUES: readonly League[] = [
  {
    name: 'SD FFL',
    path: '/fantasy/nfl/records/sdffl',
    heading: 'SD FFL Record Book',
    ppgHigh: '114.15',
    ppgLow: '91.82',
    olderSeason: '2017',
    olderChampion: 'Thien N.',
    latestSeason: '2025',
  },
  {
    name: 'Four Yard Puma',
    path: '/fantasy/nfl/records/4yp',
    heading: 'Four Yard Puma Record Book',
    ppgHigh: '113.27',
    ppgLow: '95.79',
    olderSeason: '2020',
    olderChampion: 'Mike F.',
    latestSeason: '2025',
  },
];

for (const league of LEAGUES) {
  test.describe(`${league.name} record book`, () => {
    test('hydrates without errors', async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (msg) => msg.type() === 'error' && errors.push(msg.text()));
      page.on('pageerror', (err) => errors.push(err.message));

      await page.goto(league.path);
      await page.waitForLoadState('networkidle');

      expect(errors.filter((error) => hydrationPattern.test(error))).toEqual([]);
    });

    test('is marked noindex and excluded from the sitemap', async ({ page }) => {
      await page.goto(league.path);
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

      const robots = await (await page.request.get('/robots.txt')).text();
      expect(robots).toContain('Disallow: /fantasy/');

      const sitemap = await (await page.request.get('/sitemap.xml')).text();
      expect(sitemap).not.toContain('/fantasy/');
    });

    test('renders the masthead and every rail section', async ({ page }) => {
      await page.goto(league.path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(league.heading);
      for (const id of SECTION_IDS) {
        await expect(page.locator(`section#${id}`)).toBeAttached();
      }
    });

    test('sorts a table by a clicked column', async ({ page }) => {
      await page.goto(league.path);
      const table = page.locator('#record table');
      const ppg = table.getByRole('button', { name: /^PPG/ });

      await ppg.click();
      await expect(table.locator('tbody tr').first().locator('td').nth(5)).toHaveText(league.ppgHigh);
      await ppg.click();
      await expect(table.locator('tbody tr').first().locator('td').nth(5)).toHaveText(league.ppgLow);
    });

    test('swaps a card between its chart and its table', async ({ page }) => {
      await page.goto(league.path);
      const matrixButton = page.getByRole('button', { name: 'Matrix' });
      const tableButton = page.locator('#h2h').getByRole('button', { name: 'Table' });

      await expect(matrixButton).toHaveAttribute('aria-pressed', 'true');
      await tableButton.click();
      await expect(tableButton).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator('#h2h').getByRole('columnheader', { name: /Opponent/ })).toBeVisible();
    });

    test('shows a tooltip on a matrix cell', async ({ page }) => {
      await page.goto(league.path);
      await page.locator('#h2h td[title]').first().hover();
      await expect(page.getByRole('status')).toContainText('win rate');
    });

    test('changes the standings when another season is picked', async ({ page }) => {
      await page.goto(league.path);
      const standings = page.locator('#seasons table').last();
      const select = page.locator('#seasons select');

      await select.selectOption(league.olderSeason);
      await expect(standings.locator('tbody tr').first()).toContainText(league.olderChampion);
      await select.selectOption(league.latestSeason);
      await expect(standings.locator('tbody tr').first()).not.toContainText(league.olderChampion);
    });

    test('never scrolls the page sideways on a phone', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(league.path);
      const overflow = await page.evaluate(() => {
        const doc = document.documentElement;
        return doc.scrollWidth - doc.clientWidth;
      });
      expect(overflow).toBeLessThanOrEqual(1);
    });
  });
}

test.describe('Four Yard Puma positional table', () => {
  test('appears in the scoring section, which SD FFL has no data for', async ({ page }) => {
    await page.goto('/fantasy/nfl/records/4yp');
    await expect(page.locator('#scoring').getByRole('columnheader', { name: /^Edge/ })).toBeVisible();

    await page.goto('/fantasy/nfl/records/sdffl');
    await expect(page.locator('#scoring').getByRole('columnheader', { name: /^Edge/ })).toHaveCount(0);
  });
});
