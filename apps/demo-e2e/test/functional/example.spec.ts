import { test } from '@e2e/fixtures';

test('Should have title', async ({ demoPage }) => {
  await demoPage.open();
  await demoPage.shouldHaveTitle('Welcome');
});
