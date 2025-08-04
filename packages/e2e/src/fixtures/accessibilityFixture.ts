/* eslint-disable no-empty-pattern */
import AxeBuilder from '@axe-core/playwright';
import { test as base, TestInfo } from '@playwright/test';
import { AxeResults } from 'axe-core';
import { createHtmlReport } from 'axe-html-reporter';

type Accessibility = {
  accessibilityBuilder: AxeBuilder;
  accessibilityScanReport: (axeResults: AxeResults) => void;
};

export const test = base.extend<Accessibility>({
  accessibilityBuilder: async ({ page }, use) => {
    const accessibilityBuilder = new AxeBuilder({ page })
      /**
       * Complete list of WCAG tags: https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags
       */
      .withTags(['best-practice', 'wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
    /**
     * Complete Axe rules list: https://github.com/dequelabs/axe-core/blob/master/doc/rule-descriptions.md
     * .withRules([])
     * .disableRules([])
     */
    /**
     *   We can include or exclude the particular page elements from the accessibility scan. Don't forget to waitfor() the element before starting analysis.
     * .include([])
     * .exclude([]);
     */
    await use(accessibilityBuilder);
  },

  accessibilityScanReport: async ({}, use, testInfo: TestInfo) => {
    await use((axeResults) => {
      const outputDir = 'artifacts/';
      const reportFileName = `${testInfo.title
        .replace(/\s+/g, '-')
        .toLowerCase()}-playwright-accessibility-report.html`;

      createHtmlReport({
        results: axeResults,
        options: { reportFileName, outputDir, projectKey: 'Demo' },
      });

      testInfo.attach('accessibility-scan-json', {
        body: JSON.stringify(axeResults, null, 2),
        contentType: 'application/json',
      });

      testInfo.attach('accessibility-scan-html', {
        path: `${outputDir}${reportFileName}`,
      });
    });
  },
});

export const expect = base.expect;
