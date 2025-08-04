import { mergeTests } from '@playwright/test';
import { test as a11yFixture } from './accessibilityFixture';
import { test as pagesFixture } from './pagesFixture';

export const test = mergeTests(a11yFixture, pagesFixture);

export { expect } from '@playwright/test';
