import { defineConfig } from '@playwright/test';
import { basePlaywrightBrowserStackConfig } from '@e2e/config';

const baseURL = process.env['BASE_URL'] || 'http://localhost:3000';

export default defineConfig({
  ...basePlaywrightBrowserStackConfig,
  testDir: 'apps/@nvc/pdp-e2e/test/functional',
  use: {
    ...basePlaywrightBrowserStackConfig.use,
    baseURL,
  },
});
