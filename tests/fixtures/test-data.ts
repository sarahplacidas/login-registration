/**
 * Test Data Fixtures
 * Central place for all test credentials and data.
 */

// Unique email suffix per test run to avoid duplicate-email conflicts
const timestamp = Date.now();

export interface UserData {
  name: string;
  email: string;
  password: string;
  confirm?: string;
}

export interface WeakPasswords {
  tooShort: string;
  noUppercase: string;
  noLowercase: string;
  noDigit: string;
  noSpecial: string;
  plainWeak: string;
}

export interface WrongCredentials {
  email: string;
  password: string;
}

// ── Valid user for happy-path tests ──────────────────────────────────────────
export const validUser: UserData = {
  name: 'Sarah Test',
  email: `sarah.test.${timestamp}@example.com`,
  password: 'Sarah@1234!', // strong: 8+ chars, upper, lower, digit, special
};

// ── Pre-seeded user used in duplicate-email & login tests ────────────────────
// Created via global-setup.ts before the suite runs
export const existingUser: UserData = {
  name: 'Existing User',
  email: 'existing.user@example.com',
  password: 'Exist@5678!',
};

// ── Weak passwords for negative tests ────────────────────────────────────────
export const weakPasswords: WeakPasswords = {
  tooShort: 'Ab1!',          // < 8 chars
  noUppercase: 'password1!', // missing uppercase
  noLowercase: 'PASSWORD1!', // missing lowercase
  noDigit: 'Password!!',     // missing digit
  noSpecial: 'Password12',   // missing special char
  plainWeak: 'password',     // totally weak
};

// ── Invalid email formats ─────────────────────────────────────────────────────
export const invalidEmails: string[] = [
  'notanemail',
  'missing@',
  '@nodomain.com',
  'spaces @test.com',
];

// ── Wrong credentials for negative login tests ────────────────────────────────
export const wrongCredentials: WrongCredentials = {
  email: 'nouser@example.com',
  password: 'WrongPass1!',
};
