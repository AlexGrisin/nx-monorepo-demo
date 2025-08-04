import { DemoPage } from './../pageObjects/demoPage';
import { test as base } from '@playwright/test';

type Pages = {
  demoPage: DemoPage;
};

export const test = base.extend<Pages>({
  demoPage: async ({ page }, use) => {
    await use(new DemoPage(page));
  },
});
