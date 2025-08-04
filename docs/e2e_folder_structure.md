# E2E Folder Structure

```bash
<app-name>-e2e
│
├── src/
│   └── pageObjects/                # App Specific Page Object Models if needed
│       └── components/             # Page Components
│       └── pdpPage.ts
├── test/
│   └── accessibility/              # Accessibility Test files
│       └── accessibility.test.ts
│   └── functional/                 # Functional Test files
│       └── addToCart.test.ts
│       └── productInfo.test.ts
│   └── visual/                     # Visual Test files
│       └── visual.test.ts
│
├── .env.sample                     # dotenv configuration
├── eslint.config.mjs               # ESLint configuration
├── playwright.config.ts            # Playwright configuration
├── playwright.bs.config.ts         # BrowserStack Playwright configuration
├── project.json                    # Nx project configuration
├── tsconfig.json                   # TypeScript configuration
│
packages
│
├── e2e/
│   └── src/                                # Shared utility functions, page components and constants
│       └── config/
│           └── base.playwright.config.ts   # Base Playwright configuration
│       └── constants/
│       └── data/
│       └── fixtures/
│       └── pageObjects/
│       └── steps/
│       └── types/
│       └── utils/
│   └── eslint.config.mjs                   # Base ESLint configuration for E2E tests
│   └── tsconfig.json                       # Base TypeScript configuration for E2E tests
```
