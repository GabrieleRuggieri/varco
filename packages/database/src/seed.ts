/**
 * Seed dati demo — organizzazione, utente, credenziali e membership.
 */
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { createDb } from './client.js';
import {
  organizationMembers,
  organizations,
  userCredentials,
  users,
} from './schema/index.js';

const DEMO_ORG_NAME = 'Varco Demo';
const DEMO_USER_EMAIL = 'admin@varco.local';
const LEGACY_DEMO_EMAIL = 'demo@varco.local';
const DEMO_PASSWORD = 'admin';

const run = async () => {
  const db = createDb();

  console.log('[db:seed] Inserimento organizzazione demo...');

  let org = (
    await db.select().from(organizations).where(eq(organizations.name, DEMO_ORG_NAME)).limit(1)
  )[0];

  if (!org) {
    [org] = await db
      .insert(organizations)
      .values({
        name: DEMO_ORG_NAME,
        defaultTargetCountries: ['DE', 'FR', 'IT'],
        plan: 'starter',
      })
      .returning();
    console.log(`[db:seed] Organizzazione creata: ${org?.id}`);
  } else {
    console.log('[db:seed] Organizzazione demo già presente');
  }

  if (!org) {
    throw new Error('Organizzazione demo non disponibile');
  }

  let user = (await db.select().from(users).where(eq(users.email, DEMO_USER_EMAIL)).limit(1))[0];

  if (!user) {
    const legacy = (
      await db.select().from(users).where(eq(users.email, LEGACY_DEMO_EMAIL)).limit(1)
    )[0];
    if (legacy) {
      [user] = await db
        .update(users)
        .set({ email: DEMO_USER_EMAIL, name: 'Admin' })
        .where(eq(users.id, legacy.id))
        .returning();
      console.log(`[db:seed] Utente demo rinominato: ${LEGACY_DEMO_EMAIL} → ${DEMO_USER_EMAIL}`);
    }
  }

  if (!user) {
    [user] = await db
      .insert(users)
      .values({
        email: DEMO_USER_EMAIL,
        name: 'Admin',
        emailVerified: new Date(),
      })
      .returning();
    console.log(`[db:seed] Utente demo creato: ${user?.email}`);
  } else {
    await db
      .update(users)
      .set({ name: 'Admin' })
      .where(eq(users.id, user.id));
    console.log('[db:seed] Utente demo già presente');
  }

  if (!user) {
    throw new Error('Utente demo non disponibile');
  }

  const passwordHash = await hash(DEMO_PASSWORD, 12);
  await db
    .insert(userCredentials)
    .values({ userId: user.id, passwordHash })
    .onConflictDoUpdate({
      target: userCredentials.userId,
      set: { passwordHash, updatedAt: new Date() },
    });

  await db
    .insert(organizationMembers)
    .values({
      organizationId: org.id,
      userId: user.id,
      role: 'owner',
    })
    .onConflictDoNothing();

  console.log('[db:seed] Credenziali e membership demo configurate');
  console.log(`[db:seed] Login: ${DEMO_USER_EMAIL} / ${DEMO_PASSWORD}`);
  console.log('[db:seed] Completato');
  process.exit(0);
};

run().catch((err) => {
  console.error('[db:seed] Errore:', err);
  process.exit(1);
});
