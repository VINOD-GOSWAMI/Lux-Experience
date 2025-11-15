# LuxExperience — Playwright Automation & Data Export

This repository contains Playwright-based framework


**Highlights**
- Page Object Model with component for maintainable selectors and flows
- Clean Folder Structure
-  Utilities

## Prerequisites
- Node.js `>= 18`
- `npm`
- git

## Setup
1. Clone the repository
    ```
    git clone https://github.com/VINOD-GOSWAMI/Lux-Experience.git
    ```
2. Navigate into the project directory
    ```
    cd Lux-Experience
    ```
3. Install project dependencies
    ```bash  
    npm install
    ```
4. Install Playwright browsers
    ```bash
    npx playwright install
    ```
5. Configure environment variables: Create and update the required .env.local or .env.prod file.

6. Use the default command below, or refer to the "Running Tests" section for additional execution options:
    ```bash
    npx playwright test
    ```

## Environment Configuration
- The Playwright config loads environment files based on `ENV` and uses `BASE_URL`:
- `playwright.config.ts` reads `.env.<ENV>` and sets `use.baseURL = process.env.BASE_URL`
- Create `.env.prod` or `.env.local` and set:
  ```bash
  BASE_URL=https://pocketaces2.github.io/fashionhub/
  ``` 
      (or your target base URL)
- Env File Example : .env.local
    ```.env.local
    BASE_URL=http://localhost:4000/fashionhub/
    USER_NAME=demouser
    PASSWORD=fashion123
    ```

## Running Tests
- Run all tests: 
`npm test`
- Headed mode: 
`npm run test:headed`
- HTML report: `npm run test:report` then `npx playwright show-report`
- Run the PR export only: 
`npm test tests/fetch-pull-requests.spec.ts --project=chromium --headed`
- To Run a test with a specific title, use the -g flag followed by the title of the test. 
`npx playwright test -g "add a todo item"`
- Run tests in headed mode (see browser) `npm run test:headed`

## Project Structure
### Tests

- GitHub PR Export
  - `tests/fetch-pull-requests.spec.ts` Navigates to the PR list, collects rows across all pages, writes CSV, and validates output     against `data/expected-pr.json`.

- Console Validation
  - `tests/console-check.spec.ts` asserts no console errors on key pages and crawls internal/external links and checks for errors

- Link Validation
  - `tests/link-status-check.spec.ts` asserts all discovered links return `2xx/3xx` as status code

- Login Validaton
  - `tests/login.spec.ts` contains login test suite and verify login related functionality

### Types
- `types/PullRequest.ts` defines the `PRRowData` shape

### Utilities:
- `utils/file-helper.ts` builds timestamped paths and file u 
- `utils/csv-helper.ts` writes, reads/validates csv
- `utils/link-helper.ts` console log fetch and link related utilities

### Page objects:
  - `pages/git-pull-request-page.ts` Main PR page model; wires components and handles full-page actions.
  - `pages/component/pr-list-component.ts` Maintain and manage pr list component for ui interaction 
  - `pages/component/pagination-component.ts` Maintain, control and manage pagination component for ui interaction
  - `pages/component/pr-row-component.ts` manage pr row component for ui interaction  and handles row-level actions.
  - `pages/base-page.ts` contains common interaction and page object required for page classes
  - `pages/login-page.ts` contains login test interaction
  - `pages/component/base-component.ts` contains common interaction required for component classes

### Fixtures:
  - `fixtures/loginFixture.ts`   provides reusable, pre-configured test setup that can be used in login-page (shared across tests).

### Config
- config files for framework 

### data
- test data for the framework



## Project Structure
```
.
├── pages/
│   ├── base-page.ts
|   ├── login-page.ts
│   ├── git-pull-request-page.ts
│   └── component/
│       ├── base-component.ts
│       ├── pagination-component.ts
│       ├── pr-list-component.ts
│       └── pr-row-component.ts
├── tests/
│   ├── fetch-pull-requests.spec.ts
│   ├── console-check.spec.ts
│   ├── link-status-check.spec.ts
│   └── login.spec.ts
├── utils/
│   ├── csv-helper.ts
│   ├── file-helper.ts
│   └── linkHelper.ts
├── types/
│   └── PullRequest.ts
├── data/
│   └── expected-pr.json
├── fixtures/
│   └── loginFixture.ts
├── config/
│   ├── app-url.ts
│   └── test-config.ts
├── download/                
├── playwright.config.ts
├── package.json
├── tsconfig.json
└── README.DOCKER.md
```


## Configuration

The Playwright configuration is in `playwright.config.ts`. You can modify:
- Test directory
- Browser projects
- Viewport sizes
- Timeouts
- Retry settings

## Test URLs

The tests are configured to run against:
- Production: https://pocketaces2.github.io/fashionhub/
- Login: https://pocketaces2.github.io/fashionhub/login.html
- Local: http://localhost:4000/fashionhub/

## Page Object Model

This project uses the Page Object Model (POM) pattern along with a component-based structure for better test maintainability:
- Page objects and components are located in tests/page-objects/
- Each page object represents a full page, and each component represents a reusable UI section
- Tests interact with pages and components instead of raw selectors for cleaner, maintainable code

## Continuous Integration & Docker
tbd

## Troubleshooting
- Timeouts: verify network and selectors; check `playwright.config.ts` timeouts
- Element not found: run headed and use trace; `npm run test:report` then `npx playwright show-report`
- Browser not launching: ensure browsers installed and system prerequisites met

### Tests failing due to timeouts
- Increase timeout in `playwright.config.ts`
- Check network connectivity
- Verify the application is accessible

### Element not found
- Use Playwright Inspector to debug: `npm run test:debug`
- Check selectors in page objects
- Verify element visibility/accessibility

### Browser not launching
- Install browsers: `npx playwright install`
- Check system requirements
- Verify browser permissions



## Wait Strategy (no `page.waitForTimeout`)
- Use Playwright’s auto-wait instead of manual delays.
- Use locator waits like expect(el).toBeVisible() for UI sync.
- Use waitForLoadState() when navigating between pages.
- Avoid waitForTimeout() as it makes tests flaky.
- Wait for API responses using page.waitForResponse() before asserting UI.
- Wait for loaders/spinners to disappear using expect(loader).toBeHidden().


## Best Practices

1. Use page objects for all page interactions
2. Use descriptive test names
3. Keep tests independent and isolated
4. Use appropriate wait strategies
5. Add meaningful assertions
6. Handle errors gracefully