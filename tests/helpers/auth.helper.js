/**
 * Auth Helper
 * Reusable page-action functions for authentication flows.
 * Keeps test specs clean and DRY.
 */

const BASE_URL = 'http://localhost:3000';

/**
 * Navigate to the Register page.
 * @param {import('@playwright/test').Page} page
 */
async function goToRegister(page) {
  await page.goto(`${BASE_URL}/register`);
  await page.waitForSelector('h1:has-text("Create Account")');
}

/**
 * Navigate to the Login page.
 * @param {import('@playwright/test').Page} page
 */
async function goToLogin(page) {
  await page.goto(`${BASE_URL}/login`);
  await page.waitForSelector('h1:has-text("Welcome back")');
}

/**
 * Fill and submit the registration form.
 * @param {import('@playwright/test').Page} page
 * @param {{ name: string, email: string, password: string, confirm?: string }} data
 */
async function fillRegisterForm(page, { name, email, password, confirm }) {
  await page.fill('#name', name);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.fill('#confirm', confirm ?? password); // default confirm = password
}

/**
 * Submit the registration form.
 * @param {import('@playwright/test').Page} page
 */
async function submitRegisterForm(page) {
  await page.click('button[type="submit"]');
}

/**
 * Full register flow (fill + submit).
 * @param {import('@playwright/test').Page} page
 * @param {{ name: string, email: string, password: string, confirm?: string }} data
 */
async function registerUser(page, data) {
  await goToRegister(page);
  await fillRegisterForm(page, data);
  await submitRegisterForm(page);
}

/**
 * Fill and submit the login form.
 * @param {import('@playwright/test').Page} page
 * @param {{ email: string, password: string }} data
 */
async function loginUser(page, { email, password }) {
  await goToLogin(page);
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.click('button[type="submit"]');
}

/**
 * Logout from the dashboard.
 * @param {import('@playwright/test').Page} page
 */
async function logoutUser(page) {
  await page.click('.btn-danger'); // "Sign Out" button
  await page.waitForURL('**/login');
}

/**
 * Wait for and return the server-level error alert text.
 * @param {import('@playwright/test').Page} page
 */
async function getAlertError(page) {
  const alert = page.locator('.alert.alert-error');
  await alert.waitFor({ state: 'visible', timeout: 5000 });
  return alert.textContent();
}

/**
 * Get a specific field-level error message.
 * @param {import('@playwright/test').Page} page
 * @param {string} fieldId - The input ID (e.g. 'email', 'password')
 */
async function getFieldError(page, fieldId) {
  // Field errors render right after their input's form-group
  const formGroup = page.locator(`#${fieldId}`).locator('xpath=ancestor::div[contains(@class,"form-group")]');
  const error = formGroup.locator('.field-error');
  await error.waitFor({ state: 'visible', timeout: 5000 });
  return error.textContent();
}

module.exports = {
  goToRegister,
  goToLogin,
  fillRegisterForm,
  submitRegisterForm,
  registerUser,
  loginUser,
  logoutUser,
  getAlertError,
  getFieldError,
};
