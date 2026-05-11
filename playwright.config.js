// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * Playwright Configuration
 * Docs: https://playwright.dev/docs/test-configuration
 */
module.exports = defineConfig({
  // Directory where all test files live
  testDir: './tests',

  // Runs once before all tests — seeds the DB with required test data
  globalSetup: './tests/global-setup.js',

  // Run tests in parallel across files
  fullyParallel: false, // keep false to avoid DB race conditions between tests

  // Fail the build on CI if you accidentally left test.only in source
  forbidOnly: !!process.env.CI,

  // Retry failed tests once on CI
  retries: process.env.CI ? 1 : 0,

  // Use 1 worker on CI to avoid DB race conditions; 2 locally
  workers: process.env.CI ? 1 : 2,

  // Reporter: HTML report + console output
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list'],
  ],

  use: {
    // App base URL
    baseURL: 'http://localhost:3000',

    // Collect trace on first retry for debugging
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',

    // Video on first retry
    video: 'on-first-retry',

    // 10s action timeout
    actionTimeout: 10_000,
  },

  // Run tests in Chromium by default; add Firefox/WebKit on demand
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Uncomment below to add more browsers
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  // Automatically start the dev servers before running tests
  webServer: [
    {
      command: 'cd backend && npm run dev',
      url: 'http://localhost:5000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
    {
      command: 'cd frontend && npm run dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 30_000,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  ],
});
