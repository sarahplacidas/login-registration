/**
 * Regression Tests
 * Ensure existing core functionality still works after the
 * "Add password strength validation" feature was introduced.
 */

import { test, expect } from '@playwright/test';
import { loginUser, logoutUser, goToLogin } from '../helpers/auth.helper';
import { existingUser } from '../fixtures/test-data';

test.describe('Regression — Login after password strength enhancement', () => {

  test('✅ Existing user can still login after the password strength feature was added', async ({ page }) => {
    await loginUser(page, existingUser);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dashboard-card')).toBeVisible();
  });

  test('✅ Login form still renders correctly after enhancement', async ({ page }) => {
    await goToLogin(page);

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

    await logoutUser(page);
    await expect(page).toHaveURL(/\/login/);

    // Session should be gone — /api/auth/me must return 401
    const response = await page.request.get('http://localhost:5000/api/auth/me');
    expect(response.status()).toBe(401);
  });

  test('✅ User can login again immediately after logging out', async ({ page }) => {
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

    const body = await response.json() as { status: string };
    expect(body.status).toBe('ok');
  });

});
