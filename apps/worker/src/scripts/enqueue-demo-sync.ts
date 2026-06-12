/**
 * Accoda catalog.sync per l'organizzazione demo — utile in sviluppo locale.
 * Richiede: postgres + redis + mock server attivi.
 */
import { eq } from 'drizzle-orm';
import { createDb, organizations } from '@varco/database';
import { WORKER_JOB_NAMES } from '@varco/shared';
import { getVarcoQueue } from '../lib/queue.js';

const DEMO_ORG_NAME = 'Varco Demo';

const run = async () => {
  const db = createDb();
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.name, DEMO_ORG_NAME))
    .limit(1);

  if (!org) {
    throw new Error(`Organizzazione "${DEMO_ORG_NAME}" non trovata — esegui pnpm db:seed`);
  }

  const queue = getVarcoQueue();
  const job = await queue.add(WORKER_JOB_NAMES.CATALOG_SYNC, {
    organizationId: org.id,
  });

  console.log(`[enqueue] Job ${WORKER_JOB_NAMES.CATALOG_SYNC} accodato: ${job.id}`);
  await queue.close();
  process.exit(0);
};

run().catch((err) => {
  console.error('[enqueue] Errore:', err);
  process.exit(1);
});
