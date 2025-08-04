# API Features

This test automation framework includes functionality to fetch and use data from APIs using Playwright's API testing capabilities. This is useful for setting up test data, validating responses, and performing end-to-end testing scenarios.

See Playwright API testing [documentation](https://playwright.dev/docs/api-testing)

## API: Configuration

API endpoints are configured in the `.env` file that is used for build and deployment. This file should contain the base URL and endpoints for all the APIs.

## API: Test Data Fetch

- Fetch category details

```javascript
const categoryDetails = await getCategoryDetails(accessoriesCategory);
```

- Fetch product details by commodity id

```javascript
const productDetails = await getProductDetailsById(commodityId);
```

- Fetch product details by sku

```javascript
const productDetails = await getProductDetailsBySku(commoditySku);
```

## API: Creating a Cart

This project leverages Playwright's API testing capabilities to programmatically create and manage carts for E2E scenarios. This approach ensures tests are fast, reliable, and independent of UI flows when setting up cart state.

How it works:

- Service functions (see `@e2e/src/utils/cartApiService.ts`) use Playwright's `request` API to interact with backend endpoints for cart creation, item addition, and updates.
- [Test utilities fixtures](../../packages/@e2e/src/fixtures/utilsFixture.ts) can call these utilities to set up a cart before navigating to the UI, ensuring the application is in the desired state for each test.
- This method improves test isolation and reduces flakiness by avoiding UI dependencies for setup steps.

Example usage in a test:

- Create a cart and add commodity based on the `process.env.COMMODITY_TYPE` environment variable:

```typescript
import { test } from '@e2e/fixtures';

test.describe('Cart details', () => {
  test.beforeEach(async ({ cartActions, cartPage, commodities }) => {
    await cartActions.addToCart({ commodity: commodities.testCommodity });
    await cartPage.openCartPage();
  });

  test.only('Should see cart items details', async ({ cartPage, commodities }) => {
    await cartPage.isCartProductDetailsSectionDisplayed();
    const cartItem = cartPage.getCartItemBySku(commodities.testCommodity.sku);
    await cartItem.isDisplayed();
  });
});
