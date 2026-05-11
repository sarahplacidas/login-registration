/**
 * DB Helper
 * Direct database utilities for test setup & teardown.
 * Used to seed or clean test data without going through the UI.
 *
 * Requires: pg, dotenv (installed in backend/node_modules)
 * Run from root: node -e "require('./tests/helpers/db.helper').seedExistingUser()"
 */

require('dotenv').config({ path: './backend/.env' });
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'auth_demo',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
});

/**
 * Seed the "existing user" used in duplicate-email tests.
 * Safe to call multiple times — uses INSERT ... ON CONFLICT DO NOTHING.
 */
async function seedExistingUser() {
  const { existingUser } = require('../fixtures/test-data');
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(existingUser.password, salt);

  await pool.query(
    `INSERT INTO users (name, email, password_hash)
     VALUES ($1, $2, $3)
     ON CONFLICT (email) DO NOTHING`,
    [existingUser.name, existingUser.email, hash]
  );
  console.log(`[DB Helper] Seeded existing user: ${existingUser.email}`);
}

/**
 * Remove a user by email — useful for cleanup after tests.
 * @param {string} email
 */
async function deleteUserByEmail(email) {
  await pool.query('DELETE FROM users WHERE email = $1', [email]);
  console.log(`[DB Helper] Deleted user: ${email}`);
}

/**
 * Remove all users whose emails start with the test prefix.
 * Keeps the existing seeded user intact.
 */
async function cleanTestUsers() {
  await pool.query("DELETE FROM users WHERE email LIKE 'sarah.test.%@example.com'");
  console.log('[DB Helper] Cleaned up test users');
}

/**
 * End the pool connection — call at the end of setup scripts.
 */
async function closePool() {
  await pool.end();
}

module.exports = { seedExistingUser, deleteUserByEmail, cleanTestUsers, closePool };
