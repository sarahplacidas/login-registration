/**
 * Register Tests
 * Tests for the user registration flow.
 *
 * Covers:
 * - Successful registration
 * - Duplicate email rejection
 * - Weak password rejection
 * - Password mismatch
 * - Password strength indicator
 */

import { test, expect } from '@playwright/test';
import {
  registerUser,
  goToRegister,
  fillRegisterForm,
  submitRegisterForm,
  getAlertError,
  getFieldError,
} from '../helpers/auth.helper';
import { validUser, existingUser, weakPasswords } from '../fixtures/test-data';

test.describe('Registration', () => {

  test('✅ User can register with valid strong credentials', async ({ page }) => {
    await registerUser(page, validUser);

    // Should land on the dashboard after successful registration
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.locator('.dashboard-card h2')).toContainText(validUser.name.split(' ')[0]);
  });

  test('❌ Cannot register with duplicate email', async ({ page }) => {
    // existingUser is seeded in global-setup.ts
    await registerUser(page, existingUser);

    const error = await getAlertError(page);
    expect(error).toContain('already registered');
  });

  test('❌ Weak password (no uppercase) is rejected', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, {
      name: 'Test User',
      email: 'weak.test@example.com',
      password: weakPasswords.noUppercase,
      confirm: weakPasswords.noUppercase,
    });
    await submitRegisterForm(page);

    // Expect client-side strength error — no API call made
    const error = await getFieldError(page, 'password');
    expect(error).toContain('5 requirements');
  });

  test('❌ Weak password (all lowercase, no special) is rejected', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, {
      name: 'Test User',
      email: 'weak2.test@example.com',
      password: weakPasswords.plainWeak,
      confirm: weakPasswords.plainWeak,
    });
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'password');
    expect(error).toContain('5 requirements');
  });

  test('❌ Password mismatch shows confirm error', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, {
      name: 'Test User',
      email: 'mismatch@example.com',
      password: 'Strong@Pass1',
      confirm: 'DifferentPass1!',
    });
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'confirm');
    expect(error).toContain('do not match');
  });

  test('✅ Password strength indicator shows "Strong" for valid password', async ({ page }) => {
    await goToRegister(page);
    await page.fill('#password', 'Strong@1Pass');

    // The strength indicator should appear and show "Strong"
    await expect(page.locator('.strength-label')).toBeVisible();
    await expect(page.locator('.strength-label')).toContainText('Strong');
  });

  test('✅ Password strength indicator shows "Weak" for simple password', async ({ page }) => {
    await goToRegister(page);
    await page.fill('#password', 'password');

    await expect(page.locator('.strength-label')).toContainText('Weak');
  });

});
