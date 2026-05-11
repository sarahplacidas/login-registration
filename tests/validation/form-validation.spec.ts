/**
 * Form Validation Tests
 * Tests that all required-field, format, and strength validations
 * give the user clear, accurate feedback.
 */

import { test, expect } from '@playwright/test';
import {
  goToRegister,
  goToLogin,
  fillRegisterForm,
  submitRegisterForm,
  getFieldError,
} from '../helpers/auth.helper';
import { weakPasswords } from '../fixtures/test-data';

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER — Required Fields
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Register — Required Fields Validation', () => {

  test('❌ Empty name shows "Name is required"', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, { name: '', email: 'a@b.com', password: 'Strong@1!', confirm: 'Strong@1!' });
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'name');
    expect(error).toContain('Name is required');
  });

  test('❌ Empty email shows "Email is required"', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, { name: 'Test', email: '', password: 'Strong@1!', confirm: 'Strong@1!' });
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'email');
    expect(error).toContain('Email is required');
  });

  test('❌ Empty password shows "Password is required"', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, { name: 'Test', email: 'a@b.com', password: '', confirm: '' });
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'password');
    expect(error).toContain('Password is required');
  });

  test('❌ Empty confirm password shows "Please confirm your password"', async ({ page }) => {
    await goToRegister(page);
    await page.fill('#name', 'Test');
    await page.fill('#email', 'a@b.com');
    await page.fill('#password', 'Strong@1!');
    // Leave confirm empty
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'confirm');
    expect(error).toContain('confirm your password');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER — Email Format
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Register — Invalid Email Format', () => {

  test('❌ "notanemail" is rejected', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, { name: 'Test', email: 'notanemail', password: 'Strong@1!', confirm: 'Strong@1!' });
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'email');
    expect(error).toContain('valid email');
  });

  test('❌ "missing@" is rejected', async ({ page }) => {
    await goToRegister(page);
    await fillRegisterForm(page, { name: 'Test', email: 'missing@', password: 'Strong@1!', confirm: 'Strong@1!' });
    await submitRegisterForm(page);

    const error = await getFieldError(page, 'email');
    expect(error).toContain('valid email');
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// REGISTER — Password Strength Rules
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Register — Password Strength Rules', () => {

  async function expectStrengthError(page: import('@playwright/test').Page, password: string) {
    await goToRegister(page);
    await fillRegisterForm(page, { name: 'Test', email: 'pw@test.com', password, confirm: password });
    await submitRegisterForm(page);
    const error = await getFieldError(page, 'password');
    expect(error).toContain('5 requirements');
  }

  test('❌ Password shorter than 8 chars is rejected', async ({ page }) => {
    await expectStrengthError(page, weakPasswords.tooShort);
  });

  test('❌ Password with no uppercase is rejected', async ({ page }) => {
    await expectStrengthError(page, weakPasswords.noUppercase);
  });

  test('❌ Password with no lowercase is rejected', async ({ page }) => {
    await expectStrengthError(page, weakPasswords.noLowercase);
  });

  test('❌ Password with no digit is rejected', async ({ page }) => {
    await expectStrengthError(page, weakPasswords.noDigit);
  });

  test('❌ Password with no special character is rejected', async ({ page }) => {
    await expectStrengthError(page, weakPasswords.noSpecial);
  });

});

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN — Required Fields
// ─────────────────────────────────────────────────────────────────────────────
test.describe('Login — Required Fields Validation', () => {

  test('❌ Empty email shows "Email is required"', async ({ page }) => {
    await goToLogin(page);
    await page.fill('#password', 'Something1!');
    await page.click('button[type="submit"]');

    const error = await getFieldError(page, 'email');
    expect(error).toContain('Email is required');
  });

  test('❌ Empty password shows "Password is required"', async ({ page }) => {
    await goToLogin(page);
    await page.fill('#email', 'test@example.com');
    await page.click('button[type="submit"]');

    const error = await getFieldError(page, 'password');
    expect(error).toContain('Password is required');
  });

  test('❌ Invalid email format on login is rejected', async ({ page }) => {
    await goToLogin(page);
    await page.fill('#email', 'bademail');
    await page.fill('#password', 'Something1!');
    await page.click('button[type="submit"]');

    const error = await getFieldError(page, 'email');
    expect(error).toContain('valid email');
  });

});
