/**
 * Modulo database `index` — schema Drizzle e accesso PostgreSQL.
 */
export { createDb, type Database } from './client.js';
export { withOrgContext, withUserContext, type DbTransaction } from './org-context.js';
export * from './schema/index.js';
