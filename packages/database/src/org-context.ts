/**
 * Contesto organizzazione per Row Level Security (RLS) PostgreSQL.
 *
 * Ogni query su tabelle tenant-scoped deve passare da `withOrgContext` o
 * `withUserContext` (per flussi auth cross-tenant). Imposta `SET LOCAL` sulla
 * connessione della transazione così `current_org_id()` / `varco.user_id`
 * nelle policy RLS filtrano i dati correttamente.
 */
import { sql } from 'drizzle-orm';
import type { Database } from './client.js';

/** Tipo transazione Drizzle — stesso schema del client root. */
export type DbTransaction = Parameters<Parameters<Database['transaction']>[0]>[0];

/**
 * Esegue `fn` in una transazione con `varco.org_id` impostato per RLS.
 * Usare per tutte le operazioni API/worker legate a un singolo tenant.
 */
export async function withOrgContext<T>(
  db: Database,
  organizationId: string,
  fn: (tx: DbTransaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('varco.org_id', ${organizationId}, true)`);
    return fn(tx);
  });
}

/**
 * Esegue `fn` in una transazione con `varco.user_id` per policy auth
 * (membership multi-org, login). Non imposta org_id.
 */
export async function withUserContext<T>(
  db: Database,
  userId: string,
  fn: (tx: DbTransaction) => Promise<T>,
): Promise<T> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('varco.user_id', ${userId}, true)`);
    return fn(tx);
  });
}
