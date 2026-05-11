/**
 * DB Helper
 * Direct database utilities for test setup & teardown.
 * Used to seed or clean test data without going through the UI.
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: './backend/.env' });

import { Pool } from 'pg';
import * as bcrypt from 'bcryptjs';
import { existingUser } from '../fixtures/test-data';

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
export async function seedExistingUser(): Promise<void> {
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
 */
export async function deleteUserByEmail(email: string): Promise<void> {
  await pool.query('DELETE FROM users WHERE email = $1', [email]);
  console.log(`[DB Helper] Deleted user: ${email}`);
}

/**
 * Remove all dynamically generated test users (sarah.test.* emails).
 */
export async function cleanTestUsers(): Promise<void> {
  await pool.query("DELETE FROM users WHERE email LIKE 'sarah.test.%@example.com'");
  console.log('[DB Helper] Cleaned up test users');
}

/** Close the pool connection — call at end of setup scripts. */
export async function closePool(): Promise<void> {
  await pool.end();
}
