# UI Performance Testing (TBD)

UI performance testing ensures that the user interface performs reliably and responsively under real-world usage patterns. The goal is to measure and monitor UI responsiveness, load times, and rendering behavior to prevent performance regressions before they impact end users.

## How UI Performance Testing Works

UI performance validation combines automated profiling, realistic load simulation, and continuous monitoring to detect and prevent regressions:

## Example Workflow

1. Run Lighthouse audits on key user flows as part of CI/CD.
2. Simulate backend/API load using k6 or JMeter while running UI automation scripts.
3. Collect and store performance metrics for each build.
4. Compare metrics to previous baselines and enforce performance budgets.
5. Review reports and investigate any detected regressions or bottlenecks.

## Lighthouse CI Setup

This project uses [Lighthouse CI (LHCI)](https://github.com/GoogleChrome/lighthouse-ci) to automate performance, accessibility, best practices, and SEO audits for the `demo` application.

### Configuration

The LHCI configuration is defined in the `.lighthouserc.js` file at the root of the repository:

```js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'yarn nx start demo',
      url: ['http://localhost:3000'],
      numberOfRuns: 1,
      settings: {
        preset: 'desktop',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    server: {
      port: 9001,
    },
  },
};
```

### Nx Integration

The `lhci` target is defined in `apps/demo/project.json`:

```json
{
  "targets": {
    "lhci": {
      "executor": "nx:run-commands",
      "options": {
        "command": "lhci autorun"
      }
    }
  }
}
```

### Running Lighthouse CI

To run the Lighthouse CI audits for the `demo` app, use the following Nx command:

```bash
yarn nx lhci demo
```

This will start the app, run Lighthouse audits, and upload the results to temporary public storage.

### Customization

You can adjust the URLs, performance thresholds, and other settings in `.lighthouserc.js` to fit your requirements.
