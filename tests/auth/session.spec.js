/**
 * Session Persistence Tests
 * Verifies the user stays logged in after a full page reload.
 * This works because the backend uses express-session with an httpOnly cookie.
 */

const { test, expect } = require('@playwright/test');
const { loginUser } = require('../helpers/auth.helper');
const { existingUser } = require('../fixtures/test-data');

test.describe('Session Persistence', () => {

  test('✅ User stays logged in after page refresh', async ({ page }) => {
    // Login first
    await loginUser(page, existingUser);
    await expect(page).toHaveURL(/\/dashboard/);

    // Reload the page — session cookie should keep user authenticated
    await page.reload();

    // Should still be on dashboard, not redirected to login
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dashboard-card h2')).toBeVisible();
  });

  test('✅ User stays logged in after browser back/forward navigation', async ({ page }) => {
    await loginUser(page, existingUser);
    await expect(page).toHaveURL(/\/dashboard/);

    // Navigate away and back
    await page.goto('http://localhost:3000/login');
    await page.goBack();

    // Should still be authenticated
    await expect(page.locator('.dashboard-card')).toBeVisible();
  });

  test('✅ /api/auth/me returns authenticated user during active session', async ({ page }) => {
    // Login via UI to set the session cookie
    await loginUser(page, existingUser);
    await expect(page).toHaveURL(/\/dashboard/);

    // Make a direct API call within the same browser context (cookie is shared)
    const response = await page.request.get('http://localhost:5000/api/auth/me');
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(body.authenticated).toBe(true);
    expect(body.user.email).toBe(existingUser.email);
  });

});
