import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema/index.js';

const defaultUrl = 'postgresql://varco:varco@localhost:5432/varco';

/** Crea client Drizzle con schema completo */
export function createDb(connectionString = process.env.DATABASE_URL ?? defaultUrl) {
  const client = postgres(connectionString, { max: 10 });
  return drizzle(client, { schema });
}

export type Database = ReturnType<typeof createDb>;
