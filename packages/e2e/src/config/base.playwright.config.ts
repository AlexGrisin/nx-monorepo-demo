import { defineConfig } from '@playwright/test';
import { workspaceRoot } from '@nx/devkit';
import { GrepTestFilterBuilder } from './grepTestFilterBuilder';
import { playwrightConfigProjects } from './playwrightConfigProjects';

require('tsconfig-paths/register');

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

const baseURL = process.env['BASE_URL'] || 'http://localhost:3000';
const grepBuilder = new GrepTestFilterBuilder().brand('audi').commodityType('merchandise');

const projects = playwrightConfigProjects(grepBuilder);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export const basePlaywrightConfig = defineConfig({
  snapshotPathTemplate: `{testDir}/visual/snapshots/{projectName}/{testFileName}/{arg}{ext}`,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npx nx run demo:start',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    cwd: workspaceRoot,
  },
  projects,
});
