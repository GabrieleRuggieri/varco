import { createDb, type Database } from '@varco/database';

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    db = createDb();
  }
  return db;
}
