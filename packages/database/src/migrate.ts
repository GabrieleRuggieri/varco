/**
 * Applica le migration Drizzle al database configurato in DATABASE_URL.
 */
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsFolder = path.join(__dirname, '..', 'drizzle');

const connectionString =
  process.env.DATABASE_URL ?? 'postgresql://varco:varco@localhost:5432/varco';

const run = async () => {
  const client = postgres(connectionString, { max: 1 });
  const db = drizzle(client);

  console.log('[db:migrate] Applicazione migrations da', migrationsFolder);
  await migrate(db, { migrationsFolder });
  await client.end();
  console.log('[db:migrate] Completato');
};

run().catch((err) => {
  console.error('[db:migrate] Errore:', err);
  process.exit(1);
});
