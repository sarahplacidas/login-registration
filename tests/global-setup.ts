/**
 * Global Setup — runs ONCE before all Playwright tests.
 * Seeds required database records that tests depend on.
 */

import { seedExistingUser, closePool } from './helpers/db.helper';

export default async function globalSetup(): Promise<void> {
  console.log('\n[Global Setup] Seeding test database...');
  await seedExistingUser();
  await closePool();
  console.log('[Global Setup] Done.\n');
}
