/**
 * Login Tests
 * Tests for the login flow.
 *
 * Covers:
 * - Successful login
 * - Wrong password rejected
 * - Non-existent email rejected
 * - Protected route redirects unauthenticated users
 */

import { test, expect } from '@playwright/test';
import { loginUser, goToLogin, getAlertError } from '../helpers/auth.helper';
import { existingUser, wrongCredentials } from '../fixtures/test-data';

test.describe('Login', () => {

  test('✅ User can login with valid credentials', async ({ page }) => {
    await loginUser(page, existingUser);

    // Should land on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dashboard-card h2')).toContainText(existingUser.name.split(' ')[0]);
  });

  test('❌ Wrong password shows error', async ({ page }) => {
    await loginUser(page, {
      email: existingUser.email,
      password: 'WrongPassword1!',
    });

    const error = await getAlertError(page);
    expect(error).toContain('Invalid email or password');
  });

  test('❌ Non-existent email shows error', async ({ page }) => {
    await loginUser(page, wrongCredentials);

    const error = await getAlertError(page);
    expect(error).toContain('Invalid email or password');
  });

  test('❌ Protected /dashboard redirects unauthenticated users to /login', async ({ page }) => {
    // Go directly to dashboard without logging in
    await page.goto('http://localhost:3000/dashboard');

    // Should be redirected to login
    await expect(page).toHaveURL(/\/login/);
  });

  test('❌ Unknown route redirects to /login', async ({ page }) => {
    await page.goto('http://localhost:3000/some-unknown-page');
    await expect(page).toHaveURL(/\/login/);
  });

});
