import { Page, Locator, expect } from '@playwright/test';

export class DemoPage {
  readonly page: Page;
  readonly header: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: 'Welcome' });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
  }

  async shouldHaveTitle(expectedTitle: string): Promise<void> {
    await expect(this.header).toContainText(expectedTitle);
  }
}
