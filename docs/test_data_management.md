# Test data management

Playwright **test fixtures** are used in this monorepo to provide test data to match specific environment, enabling flexible and maintainable test setups. Fixtures allow you to define and inject environment-specific or scenario-specific data into your tests, ensuring consistency and adaptability.

For more information on Playwright Fixture [docs](https://playwright.dev/docs/test-fixtures)

Playwright fixtures is used in this project to manage test data, which provides the following **Key advantages:**

- **Centralized Data Handling:** All test data is managed in one place using fixtures.
- **Scenario-Based Access:** Access test data by specific keys (e.g., brand, commodity type) to target different scenarios.
- **Environment-Specific Data:** Load different data sets depending on the environment, without changing test code.
- **Reusability:** Share data across multiple tests without duplication.

To create our own fixture, use `test.extend()` to create a new test object that will include it:

```typescript
type TestData = {
  brand: Brand;
  categories: Record<string, Category>;
  commodities: CommoditiesMap;
  commoditiesByType: CommodityTypeMap;
};

const vehicleBrand: Brand = getBrandFromBaseUrl(process.env.BASE_URL);
const commodityType: CommodityType = (process.env.COMMODITY_TYPE as CommodityType) || 'accessories';

export const test = base.extend({
  brand: async ({}, use) => {
    await use(vehicleBrand);
  },

  categories: async ({}, use) => {
    await use(categoryData[vehicleBrand]);
  },

  commodities: async ({}, use) => {
    const data = commodityData[vehicleBrand][commodityType];
    if (!data || Object.keys(data).length === 0) {
      throw new Error(`No commodity data for brand ${vehicleBrand} and type ${commodityType}`);
    }
    await use(data);
  },

  commoditiesByType: async ({}, use) => {
    const data = commodityData[vehicleBrand];
    if (!data || Object.keys(data).length === 0) {
      throw new Error(`No commodity data for brand ${vehicleBrand}`);
    }
    await use(data);
  },
});
```

Test data structure:

```bash
├── data/
│   └── categories/
│       ├── gd/
│           └── gdCategories.ts
│       ├── tacit/
│           └── tacitCategories.ts
│       └── data.ts                       # Contains all categories data
│   └── commodities/
│       └── gd/
│           ├── commodityTypes
│               ├── accessories.ts
│               ├── chargers.ts
│               ├── merchandise.ts
│               └── parts.ts
│           └── gdCommodities.ts
│       ├── tacit/
│           ├── commodityTypes
│               ├── accessories.ts
│               └── parts.ts
│           └── tacitCommodities.ts
│       └── data.ts                       # Contains all commodities data
```

Fixture can not be used anywhere in the tests. Playwright will inject the environment-specific data automatically.

```javascript
import { test } from '@e2e/fixtures';

test.describe('Product Info', () => {
  test('Should see product info on PDP', async ({ pdpPage, commodities }) => {
    await pdpPage.openPDPById(commodities.testCommodity.id);
    await pdpPage.productInfo.shouldHaveProductInfoDisplayed(commodities.testCommodity);
  });

  test('Should see different commodity types on search page', async ({ plpPage, commoditiesByType }) => {
    await plpPage.openPLP();
    await plpPage.header.searchIcon.searchTerm('search term');

    const accessoriesCommodityCard = plpPage.gridView.getCommodityCardBySku(
      commoditiesByType.accessories.testCommodity.sku,
    );
    await accessoriesCommodityCard.shippingAndPickupDetails.shouldHaveShippingDetails();

    const chargerCommodityCard = plpPage.gridView.getCommodityCardBySku(commoditiesByType.chargers.testCommodity.sku);
    await chargerCommodityCard.shippingAndPickupDetails.shouldHaveShippingDetails();
  });
});
```

Run test for specific commodity type by setting the `COMMODITY_TYPE` environment variable:

```bash
COMMODITY_TYPE=parts nx run <app-name>-e2e:e2e
```
