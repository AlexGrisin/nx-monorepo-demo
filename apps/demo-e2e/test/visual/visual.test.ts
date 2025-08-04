import { expect, test } from '@e2e/fixtures';

test.describe('Visual regression', () => {
  test('Demo entire page', async ({ page }) => {
    await page.goto('/');

    expect(await page.locator('h1').innerText()).toContain('Welcome');

    await expect(page).toHaveScreenshot({
      fullPage: true,
    });
  });
});
