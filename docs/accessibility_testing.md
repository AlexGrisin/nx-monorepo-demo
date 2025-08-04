# Accessibility Testing

This project uses Playwright for accessibility testing to ensure that all components and pages meet accessibility standards. Accessibility tests cover automated checks for common accessibility issues, ensuring compliance with WCAG guidelines.

## Storybook Component Testing

Storybook for component accessibility testing ensures that accessibility is built into the components from the ground up, leading to a more accessible and user-friendly application.

- Components are tested in isolation, without the complexity and potential interference of the entire application.
- Storybook allows for the creation of different states and scenarios for each component, ensuring that accessibility is maintained across various use cases and interactions.
- Storybook helps maintain uniform accessibility standards across all components, ensuring that they adhere to the same guidelines and best practices.

Storybook provides official a11y plugin powered by `axe-core`. Storybook configuration `apps/storybook/.storybook/main.ts` includes the accessibility addon:

```js
const config: StorybookConfig = {
  addons: [
    // Other Storybook addons
    '@storybook/addon-a11y',
  ],
};
```

Accessibility configuration is managed in `apps/storybook/.storybook/preview.tsx`. General preset can be extended with manual assertions to dismiss or modify accessibility rules:

```js
const preview: Preview = {
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'image-alt',
            enabled: false,
          },
        ],
      },
      options: {},
    },
  },
};
```

Run storybook:

```bash
nx run storybook:build
nx run storybook:storybook
```

Run storybook tests:

```bash
nx run storybook:test-storybook --url http://localhost:4400
```

Use `--json` and `--outputFile` options to generate JSON format report with the test results:

```bash
nx run storybook:test-storybook --url http://localhost:4400 --json --outputFile results.json
```

For more information about storybook accessibility see [docs](https://storybook.js.org/docs/writing-tests/accessibility-testing)

## Lighthouse Accessibility Audit

We can run Lighthouse audit to perform a general accessibility check on the entire page. Lighthouse offers automated accessibility checks, making it easier to quickly identify common issues.

TODO: add Lighthouse configuration and usage instructions.

## Playwright Accessibility Testing

Playwright is a powerful tool for automating browser interactions, making it ideal for testing the accessibility of dynamic elements such as page actions, pop-ups, and overlays.

Playwright Accessibility tests are based on the **[Axe library playwright plugin](https://www.deque.com/axe/)**

By integrating Playwright with Axe, we automate accessibility testing for dynamic elements in your application. This approach ensures that our page actions, pop-ups, and overlays remain accessible and user-friendly.

There is [Accessibility test Fixture](../packages/e2e/src/fixtures/accessibilityFixture.ts) which extends PW base test object with AXE accessibility feature. By default, it's going to scan the app page using _wcag2\*_ and _best-practice_ tags. Complete list of WCAG tags could be found in the [docs](https://www.deque.com/axe/core-documentation/api-documentation/#axe-core-tags).

The example of an accessibility test could be found in [Demo testing project](../apps/demo-e2e/test/accessibility/accessibility.test.ts). It's based on the accessibility fixture above.
