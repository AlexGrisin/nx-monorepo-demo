import { defineConfig } from '@playwright/test';
import { nxE2EPreset } from '@nx/playwright/preset';
import { basePlaywrightConfig } from '@e2e/config';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const baseURL = process.env['BASE_URL'] || 'http://localhost:3000';

export default defineConfig({
  ...nxE2EPreset(__filename, { testDir: './test/functional' }),
  ...basePlaywrightConfig,
  use: {
    ...basePlaywrightConfig.use,
    baseURL,
  },
});
