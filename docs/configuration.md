# Configuration

Playwright provides a flexible configuration system that allows you to define how your tests should run, including browser/device settings, environment variables, and TypeScript configurations. This document outlines the key aspects of configuring Playwright for your E2E tests.

## Environment configuration

By default, Playwright uses the base URL defined in the `<app-name-e2e/playwright.config.ts` file. It utilizes `@next/env` to manage environment variables stored in `<app-name-e2e/.env`. To specify the target environment, pass the environment variable when executing tests:

```bash
BASE_URL=<environment> nx run <app-name>-e2e:e2e
```

Replace <environment> with the desired environment URL.

## Browser/Device configuration

Playwright allows you to configure different browsers (Chromium, Firefox, and WebKit) to test your application across multiple platforms. We use Playwright `projects` so we can run tests on different browsers and devices.

Project describing browsers and mobile devices in scope are defined in the `playwright.config.ts`:

```javascript
projects: [
  // Desktop browsers
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'], viewport: { width: 1366, height: 768 } },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
  },

  // Mobile device
  {
    name: 'mobile-small',
    use: {
      ...devices['iPhone SE'],
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    },
  },
  {
    name: 'mobile',
    use: { ...devices['iPhone 15 Pro'] },
  },
  {
    name: 'mobile-android',
    use: { ...devices['Pixel 7'] },
  },
  {
    name: 'tablet-small',
    use: {
      ...devices['iPad Mini'],
      userAgent:
        'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    },
  },
  {
    name: 'tablet-large',
    use: { ...devices['iPad Pro 11'] },
  },
];
```

### How to use devices in test

- By device:

```javascript
test.use({ ...devices['iPhone 12 Pro'] });
```

- By viewport:

```javascript
test.use({ viewport: { width: 1600, height: 1200 } });
```

### Run projects

Playwright will run all projects by default. Use the `--project` command line option to run a single project.

```bash
nx run <app-name>-e2e:e2e -- --project firefox
```
