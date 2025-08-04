# Test Creation Coding Standards

## General coding standards

- **Avoid Duplication:** DRY (Don't Repeat Yourself). Abstract common logic into reusable functions or modules to avoid code duplication.
- **Consistent Formatting:** Maintain consistent code formatting and code style.
- **Consistent Naming Conventions:** Use camelCase for variables and functions, PascalCase for classes and interfaces.
- **Interfaces and Types:** Use interface for defining object shapes especially for shared components.
- **Avoid Hardcoding Values:** Use constants or configuration files to manage values that may change frequently.

## Playwright standards and best practices

- **Test Descriptions:** Write descriptive and meaningful test names and descriptions.
- **Test Page Objects:** Implement Page Object Model (POM) to encapsulate page structure and behavior.
- **Fixtures:** Use Playwright fixtures to set up and tear down test environments, manage test data, and share state between tests.
- **Selectors:** Use test data attributes or unique IDs for selectors. Playwright locators come with auto waiting and retry-ability. Use chaining and filtering to narrow down the search to a particular part of the page.
- **Assertions:** Use Playwright's built-in assertions for better readability and maintainability. Don't use manual assertions.
- **Setup and Teardown:** Use Playwright `beforeAll`, `beforeEach`, `afterAll`, and `afterEach` test hooks for setup and teardown.
- **Isolation:** Each test should be completely isolated from another test and should run independently with its own local storage, session storage, data, cookies etc.
- **Test Data Management:** Use fixtures, constants or factory functions to manage test data and ensure consistency.

For more Playwright Best [Practices](https://playwright.dev/docs/best-practices)

## Naming convention

Consistent naming conventions make it easier to maintain and update features, tests, page objects as the application evolves. Clear and descriptive names improve the readability of the code, it also helps in easily identifying and understanding the purpose of classes, methods, and properties.

### Test structure

#### `describe` block

- **Purpose:** Groups related tests together to provide structure and context.
- **Naming Convention:** Use descriptive names that represent the functionality or feature being tested.

Example:

```javascript
describe('User Registration Flow', () => {
  /*...*/
});
```

#### `test` block

- **Purpose:** Defines individual test cases.
- **Naming Convention:** Use concise, descriptive names that clearly state the expected outcome or behavior of the test.

Example:

```javascript
test('Should register a new user with valid details', async ({ page }) => {
  /*...*/
});
```

#### `test.step` block

- **Purpose:** The `test.step` function in Playwright allows us to define and label individual steps within a test. This enhances the readability and structure of our tests and provides detailed reporting on test execution. Group related actions within a single step to avoid over-segmentation and maintain readability.
- **Naming Convention:** Use clear and concise descriptions for each step to make the purpose and actions of each step easily understandable.

Example:

```javascript
await test.step('open category page', async () => {});
```

### Page Objects

#### Class Names

- **Purpose:** Represents a specific page or component in the application.
- **Naming Convention:** Use PascalCase for class names, use names ending with `Page` suffix to indicate it’s a page object.

Examples: `LoginPage`, `CartPage`

#### Properties

- **Purpose:** Represents elements on the page.
- **Naming Convention:** Use camelCase for property names, clearly indicating the element they refer to.

Examples: `usernameInputField`, `addToCartButton`

#### Methods

- **Purpose:** Encapsulates interactions and behaviors for the page.
- **Naming Convention:** Use camelCase for method names, describing the action or interaction.

Examples: `openCategoryPage(category: Category)`, `enterUsername(username: string)`, `submitRegistrationForm()`
