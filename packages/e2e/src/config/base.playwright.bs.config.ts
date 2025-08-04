import { defineConfig } from '@playwright/test';

export const basePlaywrightBrowserStackConfig = defineConfig({
  testMatch: '*.spec.ts',
  use: {
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    permissions: ['geolocation'],
  },
  timeout: 60_000,
  expect: { timeout: 15_000 },
  reporter: [['list'], ['html']],
  projects: [
    {
      name: 'chrome',
      use: {
        browserName: 'chromium',
        channel: 'chrome',
      },
    },
  ],
});
