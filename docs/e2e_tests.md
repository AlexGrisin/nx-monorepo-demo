# Executing E2E Tests

## Prerequisites

Before running the tests, ensure Playwright is installed in your development environment.

To install all dependencies please follow the **[setup](./setup.md)** and general **[getting started guide](../getting-started.md)**.

## Test execution

To execute all e2e tests for a specific micro front-end application, use the nx command followed by the application identifier. Below are the commands for running e2e tests for any of the applications

### Headless/CI mode

```bash
nx run <app-name>-e2e:e2e
```

### Running tests for a specific folder (e.g., `plp` or `search`)

To run only the tests under a specific folder (such as `plp` or `search`) within the `search-e2e` project, use the below option with your Nx command. This allows you to target only the relevant test files.

- Example: Run all tests in the `plp` folder

```bash
nx run search-e2e:e2e -- /test/functional/plp
```

- Example: Run all tests in the `search` folder

```bash
nx run search-e2e:e2e -- /test/functional/search
```

> **Note:**  
> The folder structure is a relative path to the folder or file.

For more details, refer to the [Playwright CLI documentation](https://playwright.dev/docs/test-cli).

### UI mode/Debugging

- Debug tests in UI mode

```bash
nx run <app-name>-e2e:e2e --ui
```

- Debug tests with the Playwright Inspector

```bash
nx run <app-name>-e2e:e2e --debug
```

For more information on Playwright Debugging [docs](https://playwright.dev/docs/running-tests#debugging-tests)

## Tag tests

Tags in Playwright allow you to group and filter tests based on certain categories or scenarios. We can tag tests to run specific subsets of test suite.

### How to tag a test

Use the `tag` property in `test` or `describe` blocks to assign one or more tags. Tags should be descriptive, e.g., `@brand-gd`, `@brand-tacit`, `@accessories`, `@parts`, `@chargers`, `@merchandise`.

```typescript
test.describe('Tag in describe block', { tag: '@brand-gd' }, () => {
  test.only('Single tag in test block', { tag: '@type-accessories' }, async ({ commodities }) => {
    // ...
  });

  test.only('Multiple tags in test block', { tag: ['@type-parts', '@smoke'] }, async ({ commodities }) => {
    // ...
  });

  test.only('Mobile only test', { tag: '@only-mobile' }, async ({ commodities }) => {
    // ...
  });

  test.only('No tags test', async ({ commodities }) => {
    // ...
  });
});
```

Best practices:

- Try to avoid `test.skip` for conditional logic. Use tags and runtime filters to control which tests run.
- Tag at both describe and test level for fine-grained control.
- Use `--grep` and `--grep-invert` to include or exclude tests as needed.
- Combine tags to target specific brand and commodity combinations.

### Running tagged tests

You can filter tests at runtime using the `--grep` option. Combine tags to target specific scenarios.

To exclude tests with specific tags, use the `--grep-invert` option. This runs all tests except those matching the given tag.

#### Running device-specific tests

```bash
# Run all tests - device filtering happens automatically
nx run search-e2e:e2e

# Run mobile-only tests
nx run search-e2e:e2e --grep "@only-mobile"

# Run desktop-only tests
nx run search-e2e:e2e --grep "@only-desktop"

# Run tablet-only tests
nx run search-e2e:e2e --grep "@only-tablet"

# Run on specific device project
nx run search-e2e:e2e --project mobile --grep "@only-mobile"
```

#### Running brand-specific tests

- All GD tests:

```bash
nx run search-e2e:e2e -- --project chromium --grep @brand-gd
```

- Run all tests except Tacit-specific ones (including common tests applicable to all brands):

```bash
nx run search-e2e:e2e -- --project chromium --grep-invert @brand-tacit
```

#### Running commodity-specific tests

- Run commodity type accessories, performance-parts or any other type add the type after '@runs-on-commodity-' tag (e.g. `@runs-on-commodity-accessories`)

```bash
nx run search-e2e:e2e --grep "@runs-on-commodity-accessories"
```

- GD accessories tests:

```bash
nx run search-e2e:e2e -- --project chromium --grep @brand-gd --grep @runs-on-commodity-accessories
```

### Automatic test filtering

To streamline test execution and ensure tests run only in relevant environments, this project uses a custom [GrepTestFilterBuilder](../packages/e2e/src/config/grepTestFilterBuilder.ts) utility. This builder generates Playwright `grep` filters automatically for each test project, enabling precise filtering by device type, brand, and commodity type.

Benefits:

- **Automatic device/brand/type filtering:** Tests run only in appropriate contexts, reducing skipped or irrelevant executions.
- **Scalable and maintainable:** New filtering conditions can be added to the builder without changing individual test files.
- **Consistent tagging:** Encourages use of descriptive tags for device, brand, and commodity type, improving test suite organization.

Best Practice:

Always tag tests with relevant device, brand, and commodity type tags. The GrepTestFilterBuilder will ensure they run only in the correct environments, making your test suite more robust and efficient.

#### How automatic test filtering works

- You can add specific tags to your tests to indicate the device type, brand, and commodity type they are relevant for
- The `GrepTestFilterBuilder` constructs a regular expression that matches tests with specific tags or tests without any restrictive tags.
- In the Playwright configuration, each project (browser/device) uses a tailored `grep` filter generated by the builder. For example, desktop projects use a filter that matches tests tagged with `@only-desktop` or those without any `@only-` tag.
- The builder can be extended to support additional filtering conditions, ensuring future scalability.

Usage in Base Playwright config:

```typescript
const grepBuilder = new GrepTestFilterBuilder().brand(vehicleBrand).commodityType(commodityType);

projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    grep: grepBuilder.deviceType('desktop').build(),
  },
  {
    name: 'mobile',
    use: { ...devices['iPhone 15 Pro'] },
    grep: grepBuilder.deviceType('mobile').build(),
  },
  // ...other projects
];
```

Usage in Test Files:

```typescript
test.describe('Mobile Navigation', { tag: ['@only-mobile'] }, () => {
  test('Should display mobile menu', async ({ page }) => {
    // Test implementation for mobile only
  });
});

test.describe('FD Features', { tag: ['@brand-gd'] }, () => {
  test('Should display desktop sidebar', async ({ page }) => {
    // Test implementation for GD site only
  });
});

test.describe('Tablet Layout', { tag: ['@runs-on-commodity-parts'] }, () => {
  test('Should display commodity feature', async ({ page }) => {
    // Test implementation for commodity feature only
  });
});
```

For more details, see the implementation in [`utils/grepTestFilterBuilder.ts`](../packages/e2e/src/config/grepTestFilterBuilder.ts) and usage in [`base.playwright.config.ts`](../packages/e2e/src/config/base.playwright.config.ts).

#### Available tags for automatic filtering

##### Device-specific tags

Use device-specific tags to automatically skip tests on inappropriate viewport types. These tags work with Playwright configuration to ensure tests only run on compatible devices.

- `@only-desktop`: Automatically runs only on desktop browsers (chromium, firefox, webkit, edge) and skips on mobile/tablet devices
- `@only-mobile`: Automatically runs only on mobile devices (mobile-small, mobile, mobile-android) and skips on desktop/tablet browsers
- `@only-tablet`: Automatically runs only on tablet devices (tablet-small, tablet-large) and skips on desktop/mobile browsers

##### Brand-specific tags

Use brand-specific tags to filter tests based on the brand being tested. This allows you to run tests for a specific brand without affecting others.

- `@brand-gd`: Runs tests specific to the GD brand
- `@brand-tacit`: Runs tests specific to the Tacit brand

##### Commodity type tags

Use commodity type tags to filter tests based on the type of commodity being tested. This allows you to run tests for specific commodity types without affecting others.

- `@runs-on-commodity-accessories`: Runs tests for accessories commodity type
- `@runs-on-commodity-parts`: Runs tests for parts commodity type
- `@runs-on-commodity-chargers`: Runs tests for chargers commodity type
- `@runs-on-commodity-merchandise`: Runs tests for merchandise commodity type

#### Extending Test Filter Builder for Custom Filters

The `GrepTestFilterBuilder` is designed to be extensible. You can subclass it to add custom filtering logic for your project's needs. For example, you might want to filter tests by additional tags such as region, environment, or feature flags. Simply extend the builder and add new methods that append lookahead patterns for your custom tags.

Example:

```typescript
class CustomGrepBuilder extends GrepTestFilterBuilder {
  // ...

  feature(feature: string) {
    return new CustomGrepBuilder([...this.lookaheads, `(?=.*(@feature-${feature}|^(?!.*@feature-)))`]);
  }
}
```

This approach allows you to keep your filtering logic modular and maintainable, supporting future requirements without changing the base builder or existing test files.

#### Project-Specific Filter Builder Configuration

Each Playwright E2E project can define and use its own grep builder instance in its configuration. This enables project-specific test filtering strategies, such as custom device, brand, or commodity filters, or even entirely new filter types. To do this, instantiate your custom builder in your project's `playwright.config.ts` and pass it to the project configuration.

Example:

```typescript
import { CustomGrepBuilder } from '@e2e/config';

const grepBuilder = new CustomGrepBuilder().brand('gd').feature('cart-v2');

export default defineConfig({
  ...basePlaywrightConfig,
  projects: [
    {
      name: 'chromium',
      grep: grepBuilder.deviceType('desktop').build(),
      // ...other settings
    },
  ],
});
```

This pattern ensures each project can tailor its test selection logic to its own requirements, supporting scalable and maintainable test automation across a large monorepo.

#### Combining Automatic Filtering with Custom Tags

Automatic test filtering with GrepTestFilterBuilder works seamlessly alongside Playwright's built-in `--grep` option. While the builder ensures that tests run only in relevant device, brand, and commodity contexts, you can further refine test selection by passing additional tags via the `--grep` CLI argument. This allows you to target specific features, scenarios, or custom tags without modifying your base filtering logic.

For example, to run only tests tagged with `@smoke` in the current device/brand/type context:

```bash
nx run <app-name>-e2e:e2e --grep "@smoke"
```

This approach provides flexible, layered filtering—automatic context-based selection from the builder, plus ad-hoc targeting with `--grep` for granular control over your test runs.

## Test Reports

The HTML Reporter is used and shows a full report of your tests allowing you to filter the report by browsers, passed tests, failed tests, skipped tests and flaky tests. After the tests have completed, you can find the test reports in the **demo/dist** directory. To open a test report for a specific application, use the **playwright show-report** command. Here is how to view the test report for the Cart application tests:

```bash
npx playwright show-report ./dist/.playwright/apps/<app-name>-e2e/playwright-report
```

The report itself could be found in the `dist` folder under the test application name along with attaches.

Repeat the **show-report** command with the appropriate path to view reports for other applications.

### Screenshots and Video

Playwright Test can capture screenshots and record videos for your tests. It is controlled by the screenshot and video options in Playwright config. It is set up as `retain-on-failure` to quickly identify and diagnose test failure issues.
