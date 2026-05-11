/**
 * Auth Helper
 * Reusable page-action functions for authentication flows.
 * Keeps test specs clean and DRY.
 */

import { Page } from '@playwright/test';
import { UserData } from '../fixtures/test-data';

const BASE_URL = 'http://localhost:3000';

/** Navigate to the Register page. */
export async function goToRegister(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/register`);
  await page.waitForSelector('h1:has-text("Create Account")');
}

/** Navigate to the Login page. */
export async function goToLogin(page: Page): Promise<void> {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForSelector('h1:has-text("Welcome back")');
}

/** Fill (but don't submit) the registration form. */
export async function fillRegisterForm(
  page: Page,
  { name, email, password, confirm }: UserData
): Promise<void> {
  await page.fill('#name', name);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.fill('#confirm', confirm ?? password); // default confirm = password
}

/** Click the submit button on any auth form. */
export async function submitRegisterForm(page: Page): Promise<void> {
  await page.click('button[type="submit"]');
}

/** Full register flow: navigate → fill → submit. */
export async function registerUser(page: Page, data: UserData): Promise<void> {
  await goToRegister(page);
  await fillRegisterForm(page, data);
  await submitRegisterForm(page);
}

/** Navigate to login, fill credentials, and submit. */
export async function loginUser(
  page: Page,
  { email, password }: { email: string; password: string }
): Promise<void> {
  await goToLogin(page);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
}

/** Click the Sign Out button on the dashboard and wait for redirect. */
export async function logoutUser(page: Page): Promise<void> {
  await page.click('.btn-danger');
  await page.waitForURL('**/login');
}

/** Wait for and return the text of the server-level error alert. */
export async function getAlertError(page: Page): Promise<string | null> {
  const alert = page.locator('.alert.alert-error');
  await alert.waitFor({ state: 'visible', timeout: 5000 });
  return alert.textContent();
}

/**
 * Get the field-level error message for a given input ID.
 * @param fieldId - The HTML id of the input (e.g. 'email', 'password')
 */
export async function getFieldError(page: Page, fieldId: string): Promise<string | null> {
  const formGroup = page
    .locator(`#${fieldId}`)
    .locator('xpath=ancestor::div[contains(@class,"form-group")]');
  const error = formGroup.locator('.field-error');
  await error.waitFor({ state: 'visible', timeout: 5000 });
  return error.textContent();
}
