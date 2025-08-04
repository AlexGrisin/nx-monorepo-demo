# Playwright test execution in Browserstack

To execute our Playwright tests in BrowserStack, we utilize the BrowserStack SDK. This integration allows you to run tests across multiple real browsers and devices, enhancing test coverage and reliability.

## BrowserStack SDK configuration

We can configure the BrowserStack SDK for Playwright using [configuration file](../browserstack.yml). In Browserstack configuration we manage our BrowserStack settings and test configurations:

- Set Browserstack **Credentials**
- Specify **Platforms** to test on
- Enable BrowserStack **Reporting**
- Use additional **Debugging** features

For more information on Browserstack SDK integration [docs](https://www.browserstack.com/docs/automate/playwright/getting-started/nodejs/integrate-your-tests-sdk)

## BrowserStack credentials

- **BrowserStack Account**: You need an active BrowserStack account.
- **BrowserStack Access Key**: Obtain your access key from your BrowserStack account settings.

Browserstack credentials should be added in [configuration file](../browserstack.yml):

```yaml
userName: <BROWSERSTACK_USERNAME HERE>
accessKey: <BROWSERSTACK_ACCESS_KEY HERE>
```

Or set BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY as env variables:

```bash
export BROWSERSTACK_USERNAME=<user_name>
export BROWSERSTACK_ACCESS_KEY=<access_key>
```

## Browserstack test execution

```bash
nx run <app-name>-e2e:browserstack
```
