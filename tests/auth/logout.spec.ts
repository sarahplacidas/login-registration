/**
 * Logout Tests
 * Verifies that logging out destroys the session and redirects properly.
 */

import { test, expect } from '@playwright/test';
import { loginUser, logoutUser } from '../helpers/auth.helper';
import { existingUser } from '../fixtures/test-data';

test.describe('Logout', () => {

  test('✅ User can logout successfully', async ({ page }) => {
    // First login
    await loginUser(page, existingUser);
    await expect(page).toHaveURL(/\/dashboard/);

    // Then logout
    await logoutUser(page);

    // Should be redirected back to login page
    await expect(page).toHaveURL(/\/login/);
  });

  test('✅ After logout, /dashboard is no longer accessible', async ({ page }) => {
    await loginUser(page, existingUser);
    await expect(page).toHaveURL(/\/dashboard/);
    await logoutUser(page);

    // Try to navigate back — should redirect to login
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('✅ After logout, login page is accessible again', async ({ page }) => {
    await loginUser(page, existingUser);
    await logoutUser(page);

    // Should show login form
    await expect(page.locator('h1')).toContainText('Welcome back');
  });

});
