import { devices } from '@playwright/test';
import { GrepTestFilterBuilder } from './grepTestFilterBuilder';

export function playwrightConfigProjects(grepBuilder: GrepTestFilterBuilder) {
  const desktopGrep = grepBuilder.deviceType('desktop').build();
  const mobileGrep = grepBuilder.deviceType('mobile').build();
  const tabletGrep = grepBuilder.deviceType('tablet').build();

  return [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
      grep: desktopGrep,
    },
    // {
    //   name: 'edge',
    //   use: { ...devices['Desktop Edge'], viewport: { width: 1920, height: 1080 } },
    //   grep: desktopGrep,
    // },
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'], viewport: { width: 1366, height: 768 } },
    //   grep: desktopGrep,
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    //   grep: desktopGrep,
    // },

    // Mobile device
    {
      name: 'mobile',
      use: { ...devices['iPhone 15 Pro'] },
      grep: mobileGrep,
    },
    // {
    //   name: 'mobile-small',
    //   use: {
    //     ...devices['iPhone SE'],
    //     userAgent:
    //       'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
    //   },
    //   grep: mobileGrep,
    // },
    // {
    //   name: 'mobile-android',
    //   use: { ...devices['Pixel 7'] },
    //   grep: mobileGrep,
    // },
    // {
    //   name: 'tablet-small',
    //   use: {
    //     ...devices['iPad Mini'],
    //     userAgent:
    //       'Mozilla/5.0 (iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
    //   },
    //   grep: tabletGrep,
    // },
    {
      name: 'tablet-large',
      use: { ...devices['iPad Pro 11'] },
      grep: tabletGrep,
    },
  ];
}
