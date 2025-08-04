# Visual Regression Test Workflow

## Visual Testing

To maintain a high-quality and consistent user experience, it is crucial that our application's UI appears exactly as designed. Visual regression testing is our automated safety net that ensures code changes do not introduce unexpected visual defects, from subtle alignment issues to major layout breakages. This practice works by capturing and comparing screenshots to detect any visual deviations from an approved baseline. Our strategy leverages the powerful, built-in visual comparison features of Playwright. To ensure this process is consistent and scalable across our monorepo, it is powered by a custom Nx executor. This document outlines our standardized workflows, configuration, and best practices for implementing effective visual tests.

---

### How Visual Regression Works

Visual regression testing works by comparing the current appearance of a UI component against a pre-approved baseline image (or "snapshot"). This simple and powerful process allows us to automatically detect unintended visual changes. The workflow consists of three main steps:

1. **Capture:** During a test run, Playwright takes a new snapshot of the component in its current state.
2. **Compare:** This new snapshot is compared pixel-by-pixel against the official baseline image stored for that test.
3. **Report:**
   - If the images match, the test passes silently.
   - If they differ, the test fails and generates a helpful visual diff image. This diff highlights the exact changes, allowing a developer to quickly assess the impact.

This entire comparison process is powered by the fast and efficient [pixelmatch library](https://github.com/mapbox/pixelmatch), which runs under the hood of Playwright's assertion engine.

### Creating Visual Tests

Visual tests use the same structure and methodology as functional tests. They leverage Playwright fixtures, utilities, and page objects to ensure consistency and reusability.

#### Capturing a Full-Page View

Full-page snapshots are powerful but should be used judiciously, as they are more susceptible to minor, unrelated changes.

**How To:**

```typescript
await expect(page).toHaveScreenshot({ fullPage: true });
```

**Best for:**

- Validating the overall layout and composition of a complex page.
- Testing global styles or themes that affect the entire view.
- Scenarios where the relationship and spacing between multiple components are critical.

#### Capturing a Specific Element or Component

Testing a single component in isolation makes the test less fragile and easier to debug.

**How To:**

```typescript
await expect(page.getByTestId('slideout-content')).toHaveScreenshot();
```

**Best for:**

- Verifying the appearance of individual UI components.
- Creating focused tests that are not affected by changes in other parts of the page.

#### Masking Dynamic Content

To prevent flaky tests caused by data that changes on every run (e.g., timestamps, animations), you must mask these elements. Masking covers the selected elements with a solid pink (#FF00FF) box, excluding them from the pixel comparison.

**How To:**

```typescript
await expect(page).toHaveScreenshot({
  mask: [headerElement, footerElement],
  fullPage: true,
});
```

**Best for:**

- Ignoring non-deterministic content like dates, times, randomly generated data, or active animations.
- Stabilizing tests that include third-party ads or user-specific information.

#### Standard Location is Mandatory

All visual test files follow the standard E2E folder structure under: `apps/<app-name>-e2e/tests/visual`.

This aligns with shared Playwright config and snapshot storage paths. Adhering to this convention is essential for our shared Playwright configuration and flow pipelines to automatically discover tests, resolve snapshot paths, and manage artifacts correctly.

#### Best Practices

- **Prioritize Determinism:** A test must produce the same result every time it runs.
- **Wait for Stability:** Always ensure the page is in a stable state before taking a snapshot.
- **Name Tests and Snapshots Clearly:** Playwright generates snapshot filenames from the test title.

### Visual Regression Configuration

All visual regression test behavior is controlled through our Playwright configuration files (`playwright.config.ts`). Our strategy employs a hierarchical approach, using a central base configuration to ensure consistency, while allowing for project-specific overrides when necessary.

#### Configuration Strategy: Base vs. Project-Specific

- **Shared Base Configuration:** A central configuration [file](../packages/e2e/src/config/base.playwright.config.ts) defines the standard settings for all projects. This ensures that every team benefits from a consistent, strict, and stable testing foundation out of the box.
- **Project-Specific Overrides:** While the base configuration should be sufficient for most cases, individual projects can extend and override these settings in their own `playwright.config.ts` file. This should only be done to address specific needs and must be clearly documented.

#### Key Configuration Parameters

The following parameters within the `expect.toHaveScreenshot` object are critical to our visual testing strategy:

- `snapshotPathTemplate`: Path template that defines the file path and naming convention for storing and retrieving snapshot files.
- `maxDiffPixelRatio`: A ratio (from 0 to 1) representing the percentage of pixels that are allowed to differ before a test fails. Default is 0, enforcing a zero-tolerance, pixel-perfect match.
- `maxDiffPixels`: An absolute number of pixels that are allowed to differ. This is an alternative to maxDiffPixelRatio.
- `animations`: Controls the handling of CSS transitions and animations during testing.

For a complete list of all available options and their technical details, please refer to the official [documentation](https://playwright.dev/docs/api/class-page#page-screenshot).

#### Threshold and Tolerance Strategy

The integrity of our visual regression suite depends on a strict and deliberate approach to managing comparison thresholds.

Our base configuration is intentionally set with a threshold of 0. This means that by default, any difference, no matter how small, will cause a test to fail. This forces developers to explicitly account for every visual change, preventing unintended regressions.

Overriding the zero-tolerance policy should be a last resort, not a first-line fix. Before adjusting the threshold for a failing test, you must first:

- Confirm it is not a bug: Rule out any actual code regressions.
- Confirm it is not dynamic content: Ensure all dates, times, user data, or IDs have been properly mocked or masked.
- Confirm animations are disabled: Verify that an unhandled animation is not causing the instability.

An override is acceptable for addressing unavoidable, minor rendering differences.

### Running Visual Regression

Tests Visual tests can be run locally during development to get instant feedback on your changes. This same command is also used by our CI/CD pipeline to validate pull requests.

To run the visual test suite for a specific application:

```sh
nx run @nvc/<app-name>-e2e:visual visual
```

Upon completion, the terminal will show a summary of the results. If any differences were found, the command will fail and an HTML report will be generated.

### Analyzing Visual Differences

When a test fails, you must analyze the differences using the interactive Playwright report.

The report includes an interactive viewer designed to make analysis easy:

- **Baseline image:** The "source of truth." This is the previously approved reference snapshot from our GCP bucket.
- **Actual image:** This is the new screenshot captured during the latest test run, including your changes.
- **Side-by-Side Diff:** This image highlights the exact pixel differences between the Baseline and Actual images in bright red, making it easy to spot even the most subtle changes.

The report also includes a slider that allows you to swipe between the Baseline and Actual images, providing a clear, interactive way to inspect the changes.

More info: Playwright Visual Snapshots [documentation](https://playwright.dev/docs/test-snapshots).

## Integrating Visual Regression into Microfrontend Projects

Our monorepo architecture standardizes visual regression testing across all microfrontend applications. This is achieved through a shared, custom Nx Executor, which encapsulates all the complex logic. This approach provides two key benefits:

- **Consistency:** Every project uses the exact same process for testing and updating baselines.
- **Simplicity:** Adding visual regression to a new or existing MFE project requires minimal configuration.

### Custom NX Executor

At the core of our strategy is a custom visual [executor](../tools/executors/src/executors/visual/executor.ts). This powerful script is responsible for:

- Connecting to our central GCP bucket to download baseline snapshots.
- Running the Playwright test suite in the correct mode.
- Comparing newly generated snapshots against the baseline.
- Uploading new snapshots to GCP when a baseline reset is triggered.

By using this shared executor, we avoid duplicating logic in every MFE project.

### Configure Targets

Add a custom target in the project's `project.json` using the Nx visual executor.

- Open the `project.json` file for your E2E application, located at `apps/<app-name>-e2e/project.json`.
- Add the following two targets to the targets:

```json
"targets": {
  // ... other existing targets
  "visual": {
    "executor": "./tools/executors:visual",
    "options": {
      "gcpBucketName": "nvc-visual-regression"
    }
  },
  "visual-reset": {
    "executor": "./tools/executors:visual",
    "options": {
      "gcpBucketName": "nvc-visual-regression",
      "updateSnapshots": true
    }
  }
}
```

### Understanding the New Targets

These targets provide two distinct modes of operation for visual testing:

- `visual`
  - **Purpose:** To compare the current UI against the established baseline.
  - **Use Case:** This is the primary target for running checks locally or in a CI pipeline. It will exit with an error if any visual differences are found.
- `visual-reset`
  - **Purpose:** To update the baseline. The `updateSnapshots: true` flag instructs the executor to generate new snapshots and upload them to GCP as the new source of truth.
  - **Use Case:** This is a manual-only action. It should only be run by a developer after they have verified that the visual changes are correct and intentional.

## Snapshots Management

Our snapshot management strategy is designed to be robust, scalable, and transparent for developers. It integrates our Nx monorepo tooling directly with Google Cloud Platform to provide a single source of truth for all visual baseline images.

### Guiding Principles

The architecture is built on three core principles:

- **Centralized Storage:** All approved baseline snapshots are stored in a single Google Cloud Storage bucket. This prevents fragmentation and ensures every developer and CI job compares against the same source of truth.
- **Automated Synchronization:** Our custom Nx executor handles all communication with GCS. Developers never need to manually upload or download snapshots; the tooling does it automatically.
- **Consistent Structure:** A standardized path and naming convention is enforced by both Playwright's configuration and our executor, ensuring snapshots are always stored and retrieved from the correct location.

### Core Components

The following components work together to manage the entire snapshot lifecycle:

- **GCP Bucket:** The central cloud storage for all approved baseline snapshots (nvc-visual-regression).
- **Nx Executor:** Orchestrates the entire process of downloading baselines, running tests, and uploading new baselines [Nx executor](../tools/executors/src/executors/visual/executor.ts).
- **GCP Storage Manager:** The module within the executor that contains the specific logic for communicating with the Google Cloud Storage API [gcStorageManager](../tools/executors/src/executors/visual/gcStorageManager.ts).
- **Playwright Config:** Defines the snapshotPathTemplate to match the GCS folder structure, ensuring local and remote paths are aligned [base config](../packages/e2e/src/config/base.playwright.config.ts).

### The Snapshot Lifecycle

The executor automates the flow of snapshots between the GCS bucket and your local environment.

- **When you run a comparison test** (`nx run <app-name>-e2e:visual`):
  - The executor invokes the gcStorageManager to download the relevant baseline images from the GCP bucket to your local machine.
  - Playwright runs and compares the UI's current state against these downloaded baselines.
  - No files are uploaded; this is a read-only operation against the central baseline.
- **When you reset the baseline** (`nx run <app-name>-e2e:visual-reset`):
  - The executor runs Playwright with the updateSnapshots flag set to true. This generates new snapshots locally, overwriting the old ones on your disk.
  - After the test run, the gcStorageManager uploads these newly generated snapshots to the GCP bucket, replacing the previous baselines.
  - This action establishes a new source of truth for that test.

### Authenticating with Google Cloud

To allow the Nx executor to communicate with our GCS bucket, you must first authenticate your local machine. This is a one-time setup process.

- **Install the Google Cloud SDK:** If you haven't already, follow the official instructions to install the `gcloud` CLI on your machine. [Official Guide: Install the gcloud CLI](https://cloud.google.com/sdk/docs/install).
- **Authenticate Your Account:** To authenticate your application with Google Cloud, use the following command:

```bash
gcloud auth application-default login
```

This command will open a browser window, asking you to log in with your Google account. Upon successful authentication, it will store the necessary credentials locally, allowing our scripts and tools to securely access the GCS bucket on your behalf.

## Visual Regression Flows

Our visual regression testing strategy is powered by two core automated pipelines: one for running tests and comparing snapshots, and another for managing and updating the baseline snapshots.

### Visual Regression Test and Compare Flow

This pipeline runs automatically on triggers like a pull request or a commit to a development branch. Its purpose is to detect any visual deviations from the established baseline.

#### Pipeline Flow

Pipeline trigger ↓ Baseline snapshot exists in GCS bucket?

- Yes → Continue with test
- No → Report Test **Fail**

↓ Pull baseline snapshots from GCS bucket

↓ Generate current snapshot

↓ Compare with baseline

↓ Difference found?

- Yes → Report Test **Pass**
- No → Report Test **Fail**

↓ Upload Playwright report to GCS bucket

**Report Result:**

- Report Test Pass: The test is considered successful if no discrepancies are identified.
- Report Test Failure: If any discrepancies are identified, the test fails, indicating that a manual review is necessary.

### Reset and Upload Baseline Flow

This pipeline is used to intentionally update the baseline snapshots after a valid UI change has been approved. It is a manually-triggered process with built-in access control.

The flow is as follows:

Approver role?

- Yes → Trigger pipeline

↓ Select reset type:

- Per application/component
- Full reset

↓ Generate baseline snapshot

↓ GCS snapshot exists?

- Yes → Overwrite existing snapshots
- No → Create new snapshots

↓ Upload snapshots to GCS bucket

↓ Notify and log snapshot baseline change

**Upload Snapshots:**

The newly generated snapshots are uploaded to the GCP bucket, replacing or adding to the official baseline.

### Recommendations for Baseline Management and Versioning

- **Per-Branch Baselines**
  - Maintain distinct baselines for each long-lived branch (e.g., `develop`, `release/*`).
  - Prevent cross-branch pollution.
  - Implement a branch-specific GCP path structure.
- **Scoped Baseline Updates**
  - Restrict snapshot resets to designated tests or components rather than performing full resets.
  - Utilize CLI filters or test tags to regenerate only the elements that have changed.
- **Versioning**
  - Store each snapshot along with its corresponding commit hash.
  - Retain a limited number of previous baselines to facilitate rollback or comparison between specific versions.
  - Consider establishing cleanup policies to optimize cost savings.

## Visual Regression Approval Process

This section outlines the automated and manual workflow for running visual regression tests, reviewing differences, and managing the approval process for baseline updates.

### Automated Testing and Difference Detection

The process begins when a trigger, such as a code commit to a pull request, initiates the visual regression test suite.

- **Run Visual Regression:** The system automatically executes the tests, capturing new snapshots of the UI components or pages.
- **Check for Visual Difference:** The newly captured snapshots are compared pixel-by-pixel against the established "baseline" snapshots.
- **Decision: Difference Found?**
  - **No:** If no visual differences are detected, the test is reported as passed. No further action is needed.
  - **Yes:** If any visual differences are found, the test is reported as failed. This initiates a manual review process.

### Manual Triage and Review

When a visual difference is detected, the responsible application owners are notified and a manual review is required to determine the nature of the change.

- **Snapshot Review:** The reviewer analyzes the difference using a side-by-side diff report.
- **Decision:** Is this a valid change or a bug?
  - **It's a Bug:** If the change is an unintended visual defect, it is flagged as a UI bug. The associated code changes may be put on hold pending a fix.
  - **It's a Valid Change:** If the change is an intentional result of new development or a design update, the reviewer must request a baseline reset to accept the new snapshot as the source of truth.

### The Approval Gate: Updating the Baseline

All requests to update a baseline snapshot must go through a formal approval gate to ensure changes are intentional, verified, and auditable.

- **Request Baseline Reset:** A request is filed, which enters the approval queue.
- **Review and Decision:** An authorized approver reviews the request.
  - **Denied:** If the reviewer denies the request, the baseline is not updated. The pull request will remain in a failed state until the visual discrepancy is resolved.
    - **Notify User:** The original requester is notified that the visual discrepancy has to be resolved.
  - **Approved:** If the reviewer approves the request, the following actions occur:
    - **Reset Baseline:** Once approved, the requester must manually trigger the reset pipeline.
    - **Annotate Baseline:** The new baseline is annotated with contextual information, such as the associated ticket number (Jira, GitHub Issue) and Figma reference, as per the review requirements.
    - **Log Change:** A record of the approval (including who approved it and when) is written to a change log for audit and tracking purposes.
    - **Notify User:** The original requester is notified that the baseline has been successfully updated.

### Roles, Responsibilities, and Requirements

To maintain the integrity of the UI baseline, only specific roles are authorized to approve a baseline reset.

#### Snapshot Review Requirements

Before approval can be granted, the review request must meet **all** of the following criteria:

- **Side-by-Side Diff:** A clear visual report must show the differences between the old and new snapshots.
- **Ticket Association:** The change must be linked to a ticket (e.g., Jira issue, GitHub issue) or a Figma design reference for context.

### Ownership by Workflow / Team

To ensure clear accountability, baseline ownership is federated by team or domain:

- Each workflow (e.g., `@pdp`, `@cart`) is treated as a bounded UI domain.
- The responsibility for maintaining and approving baseline snapshot updates for a specific domain lies with that domain's owning team.
