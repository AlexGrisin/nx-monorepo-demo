# Demo

## Getting Started

### Pre-requisites

- VS Code IDE / WebStorm IDE
- Typescript - <https://www.typescriptlang.org/>
- Install `git` - <https://formulae.brew.sh/formula/git>
- Install `node v18.19.0` or higher - <https://formulae.brew.sh/formula/node#default>
- Install `nvm` (optional) - <https://formulae.brew.sh/formula/nvm#default> (Why nvm - <https://github.com/nvm-sh/nvm>)

### Install package manager

- npm - `npm i -g npm`
- yarn - `npm i -g yarn`

Learn how to work with `npm`:

- Official [docs](https://docs.npmjs.com)

#### Build system for monorepos

Install: `npm i -g nx`

### Clone repository

- Clone: `git clone git@github.ford.com:sterlingoms/playwright-automation.git`
- Repo: <https://github.ford.com/eComm360-Foundational-Service/web-app>

Learn how to work with `git`:

- [Docs](https://docs.github.com/en/get-started/using-git/about-git)
- [Course](https://skills.github.com)

### Install dependencies

- Project dependencies: `yarn install`
- Playwright browsers: `npx playwright install`

## Configuration

### Environment Variables

Monorepo projects use `dotenv` to manage environment-specific configurations, such as API endpoints and authentication details. Ensure you have necessary variables defined in your `.env` files.

Documentation: [dotenv](https://github.com/motdotla/dotenv)

### Playwright Configuration

#### Playwright Configuration File

Playwright's configuration is managed via a `playwright.config.ts` file, which allows us to define global settings for your tests:

- Projects – Define multiple projects. For more info: [project](./testing.md#browserdevice-configuration)
- Timeouts – Set global timeouts for test actions, like element wait time. For more info refer to [documentation](https://playwright.dev/docs/test-timeouts)
- Test Runners – Customize test runners
  - [Parallel execution](https://playwright.dev/docs/test-parallel)
  - [Test retries](https://playwright.dev/docs/test-retries)
- Reporter – Define how test results are reported. For more info refer to [documentation](https://playwright.dev/docs/test-reporters)

In our monorepo with a microfrontends architecture, we use a base Playwright [configuration](./packages/e2e/src/config/base.playwright.config.ts) to define global rules, which are then extended for each individual app.

Learn more about playwright test configuration: [documentation](https://playwright.dev/docs/test-configuration)

#### Playwright Command Line Configuration

We can also manage the Playwright test execution configuration directly via the command line, allowing us to customize various settings such as which project to use, or the number of retries, all without needing to modify the configuration file. This provides flexibility and control over test execution for different scenarios and environments.

Learn more about playwright command line: [documentation](https://playwright.dev/docs/test-cli)

---

## Run tasks

To run the dev server for your app, use:

```sh
npx nx dev demo
```

To create a production bundle:

```sh
npx nx build demo
```

To see all available targets to run for a project, run:

```sh
npx nx show project demo
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

Use the plugin's generator to create new projects.

To generate a new application, use:

```sh
npx nx g @nx/next:app demo
```

To generate a new library, use:

```sh
npx nx g @nx/react:lib mylib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn more about this workspace setup](https://nx.dev/nx-api/next?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
