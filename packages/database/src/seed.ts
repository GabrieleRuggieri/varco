/**
 * Seed dati demo — organizzazione e utente di sviluppo.
 * Catalogo e matrice: vedi `pnpm matrix:seed` (fase matrix).
 */
import { eq } from 'drizzle-orm';
import { createDb } from './client.js';
import { organizations, users } from './schema/index.js';

const DEMO_ORG_NAME = 'Varco Demo';
const DEMO_USER_EMAIL = 'demo@varco.local';

const run = async () => {
  const db = createDb();

  console.log('[db:seed] Inserimento organizzazione demo...');

  const existingOrg = await db
    .select()
    .from(organizations)
    .where(eq(organizations.name, DEMO_ORG_NAME))
    .limit(1);

  if (existingOrg.length === 0) {
    const [org] = await db
      .insert(organizations)
      .values({
        name: DEMO_ORG_NAME,
        defaultTargetCountries: ['DE', 'FR', 'IT'],
        plan: 'starter',
      })
      .returning();
    console.log(`[db:seed] Organizzazione creata: ${org?.id}`);
  } else {
    console.log(`[db:seed] Organizzazione demo già presente`);
  }

  const [user] = await db
    .insert(users)
    .values({
      email: DEMO_USER_EMAIL,
      name: 'Demo Seller',
    })
    .onConflictDoNothing()
    .returning();

  if (user) {
    console.log(`[db:seed] Utente demo: ${user.email}`);
  }

  console.log('[db:seed] Completato');
  process.exit(0);
};

run().catch((err) => {
  console.error('[db:seed] Errore:', err);
  process.exit(1);
});
