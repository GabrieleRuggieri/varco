/**
 * Accoda catalog.sync per l'organizzazione demo — utile in sviluppo locale.
 */
import { eq } from 'drizzle-orm';
import { createDb, organizations } from '@varco/database';
import { closeVarcoQueue, enqueueCatalogSync } from '@varco/queue';

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

  const job = await enqueueCatalogSync({ organizationId: org.id });
  console.log(`[enqueue] catalog.sync accodato: ${job.id}`);
  await closeVarcoQueue();
  process.exit(0);
};

run().catch((err) => {
  console.error('[enqueue] Errore:', err);
  process.exit(1);
});
