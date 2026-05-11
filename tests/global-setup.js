/**
 * Global Setup — runs ONCE before all Playwright tests.
 * Seeds required database records that tests depend on.
 */

const { seedExistingUser, closePool } = require('./helpers/db.helper');

module.exports = async function globalSetup() {
  console.log('\n[Global Setup] Seeding test database...');
  await seedExistingUser();
  await closePool();
  console.log('[Global Setup] Done.\n');
};
