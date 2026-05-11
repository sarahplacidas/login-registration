/**
 * Test Data Fixtures
 * Central place for all test credentials and data.
 * Using random suffixes where needed to avoid duplicate-email conflicts.
 */

// A helper to generate a unique email per test run
const timestamp = Date.now();

const testData = {
  // ── Valid user for happy-path tests ──────────────────────────────────────
  validUser: {
    name: 'Sarah Test',
    email: `sarah.test.${timestamp}@example.com`,
    password: 'Sarah@1234!',      // strong: 8+ chars, upper, lower, digit, special
  },

  // ── Pre-seeded user used in duplicate-email & login tests ────────────────
  // This user is created via the API before the test suite runs (see db.helper.js)
  existingUser: {
    name: 'Existing User',
    email: 'existing.user@example.com',
    password: 'Exist@5678!',
  },

  // ── Weak passwords for negative tests ────────────────────────────────────
  weakPasswords: {
    tooShort: 'Ab1!',             // < 8 chars
    noUppercase: 'password1!',    // missing uppercase
    noLowercase: 'PASSWORD1!',    // missing lowercase
    noDigit: 'Password!!',        // missing digit
    noSpecial: 'Password12',      // missing special char
    plainWeak: 'password',        // totally weak
  },

  // ── Invalid email formats ─────────────────────────────────────────────────
  invalidEmails: ['notanemail', 'missing@', '@nodomain.com', 'spaces @test.com'],

  // ── Wrong credentials for negative login tests ────────────────────────────
  wrongCredentials: {
    email: 'nouser@example.com',
    password: 'WrongPass1!',
  },
};

module.exports = testData;
