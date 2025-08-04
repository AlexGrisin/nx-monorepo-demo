# Visual Regression Testing

Visual regression testing ensures that UI changes do not introduce unexpected visual defects. Playwright provides built-in support for capturing and comparing screenshots to detect visual changes.

## How Visual Regression Works

Playwright captures screenshots of web pages or components during test runs and compares them to previously approved baseline images. If differences are detected, the test fails and a diff image is generated for review.

Under the hood, Playwright Test uses the [pixelmatch](https://github.com/mapbox/pixelmatch) library. You can pass various options to modify its behavior.

## Creating Visual Regression Tests

To create a visual regression test, use the `expect` assertion with the `toHaveScreenshot` method. This method captures a screenshot of the current page or element and compares it to a baseline image.

```typescript
await expect(page).toHaveScreenshot();
```

You can mask dynamic elements or capture full-page screenshots:

```typescript
await expect(page).toHaveScreenshot({
  mask: [headerElement, footerElement],
  fullPage: true,
});
```

You can also use `toHaveScreenshot` with a specific selector to capture only a part of the page:

```typescript
await expect(page.getByTestId('slideout-content')).toHaveScreenshot();
```

## Visual regression configuration

Visual regression testing in Playwright is configured through the Playwright config file `playwright.config.ts`. This defines how and where screenshots are stored, the comparison thresholds, and which browsers or devices are used for testing.

Key configuration options include:

- `snapshotPathTemplate`: Path template for storing visual snapshots, set in the base config for consistent organization
- `maxDiffPixelRatio`: Pixel difference ratio threshold for failing tests.
- `maxDiffPixels`: Maximum allowed pixel difference for a test to pass.
- `animations`: Controls CSS animations, CSS transitions and Web Animations.

A shared base Playwright [config](../packages/e2e/src/config/base.playwright.config.ts) sets default options for all E2E projects, including a `maxDiffPixelRatio` of `0` for strict visual comparison (no tolerance for pixel differences). This ensures that any visual change is detected and flagged during test runs. Projects can extend or override these settings in their own `playwright.config.ts` files to adjust thresholds, snapshot paths, or add device-specific options as needed.

For more details on configuration options, refer to the [documentation](https://playwright.dev/docs/api/class-page#page-screenshot).

## Running Visual Regression Tests

To execute visual regression tests, run the E2E test suite as usual:

```bash
nx run <app-name>-e2e:visual -- visual
```

Failed tests with visual differences will generate diff images and mark the test as failed.

## Reviewing Visual Diffs

After running tests, open the Playwright HTML report to review visual diffs.

In the report, failed visual tests display the baseline, actual, and diff images side by side for easy comparison.

## Snapshots Management

The `snapshotPathTemplate` setting in the base Playwright [config](../packages/e2e/src/config/base.playwright.config.ts) is aligned with the Nx visual executor for snapshot management with Google Cloud Platform. This alignment ensures that both local and remote storage of visual regression snapshots follow a consistent directory structure, making it seamless to upload, download, and manage baseline images between your local environment and the GCP bucket.

The Nx visual executor uses the [gcStorageManager](../tools/executors/src/executors/visual/gcStorageManager.ts) utility to synchronize snapshots with GCP. This integration allows automated handling of baseline images, including uploading new snapshots and downloading existing baselines as part of your test workflow.

Key points:

- Consistent snapshot directory structure between Playwright and Nx executor.
- Automated upload/download of snapshots to/from GCP using NX Visual Executor.
- Supports both comparison and reset flows for visual regression baselines.
- Enables reliable and scalable visual testing.
