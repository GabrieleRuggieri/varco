/**
 * Modulo worker `db` — job asincroni BullMQ.
 */
import { createDb, type Database } from '@varco/database';

let db: Database | null = null;

/** Esportazione `getDb` — vedi implementazione sotto. */
export function getDb(): Database {
  if (!db) {
    db = createDb();
  }
  return db;
}
