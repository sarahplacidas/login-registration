/**
 * Regression Tests
 * Ensure existing core functionality still works after the
 * "Add password strength validation" feature was introduced.
 *
 * These are intentionally simple — catching regressions, not new behaviour.
 */

const { test, expect } = require('@playwright/test');
const { loginUser, logoutUser, goToLogin } = require('../helpers/auth.helper');
const { existingUser } = require('../fixtures/test-data');

test.describe('Regression — Login after password strength enhancement', () => {

  test('✅ Existing user can still login after the password strength feature was added', async ({ page }) => {
    // The existing user was seeded BEFORE the strength feature.
    // Their password meets all new rules, so login should still work.
    await loginUser(page, existingUser);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dashboard-card')).toBeVisible();
  });

  test('✅ Login form still renders correctly after enhancement', async ({ page }) => {
    await goToLogin(page);

    // Verify all key elements are present
    await expect(page.locator('h1')).toContainText('Welcome back');
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

});

test.describe('Regression — Logout still clears session properly', () => {

  test('✅ Logout clears session and prevents access to protected routes', async ({ page }) => {
    await loginUser(page, existingUser);
    await expect(page).toHaveURL(/\/dashboard/);

    // Logout
    await logoutUser(page);
    await expect(page).toHaveURL(/\/login/);

    // Confirm session cleared — /api/auth/me should return 401
    const response = await page.request.get('http://localhost:5000/api/auth/me');
    expect(response.status()).toBe(401);
  });

  test('✅ User can login again immediately after logging out', async ({ page }) => {
    // Login → Logout → Login again
    await loginUser(page, existingUser);
    await logoutUser(page);

    // Login a second time
    await loginUser(page, existingUser);
    await expect(page).toHaveURL(/\/dashboard/);
  });

});

test.describe('Regression — API health check', () => {

  test('✅ Backend health endpoint returns 200 OK', async ({ request }) => {
    const response = await request.get('http://localhost:5000/api/health');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe('ok');
  });

});
