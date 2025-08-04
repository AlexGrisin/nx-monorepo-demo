import { test, expect } from '@e2e/fixtures';

test.describe('Accessibility tests', () => {
  test('should not have any automatically detectable accessibility issues', async ({
    page,
    accessibilityBuilder,
    accessibilityScanReport,
  }) => {
    await page.goto('/');

    const accessibilityScanResults = await accessibilityBuilder.analyze();

    accessibilityScanReport(accessibilityScanResults);

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});
