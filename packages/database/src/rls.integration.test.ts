/**
 * Test integrazione contesto org — verifica SET LOCAL su PostgreSQL.
 * Richiede DATABASE_URL e INTEGRATION_TEST=1 (CI con servizio postgres).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sql } from 'drizzle-orm';
import { createDb } from './client.js';
import { withOrgContext, withUserContext } from './org-context.js';

const runIntegration = process.env.INTEGRATION_TEST === '1';

test('withOrgContext imposta varco.org_id nella transazione', { skip: !runIntegration }, async () => {
  const db = createDb();
  const orgId = '550e8400-e29b-41d4-a716-446655440001';

  const rows = await withOrgContext(db, orgId, (tx) =>
    tx.execute(sql`SELECT current_setting('varco.org_id', true) AS org_id`),
  );

  const setting = (rows as { org_id: string }[])[0]?.org_id;
  assert.equal(setting, orgId);
});

test('withUserContext imposta varco.user_id nella transazione', { skip: !runIntegration }, async () => {
  const db = createDb();
  const userId = '550e8400-e29b-41d4-a716-446655440002';

  const rows = await withUserContext(db, userId, (tx) =>
    tx.execute(sql`SELECT current_setting('varco.user_id', true) AS user_id`),
  );

  const setting = (rows as { user_id: string }[])[0]?.user_id;
  assert.equal(setting, userId);
});

test('contesto org non persiste oltre la transazione', { skip: !runIntegration }, async () => {
  const db = createDb();
  const orgId = '550e8400-e29b-41d4-a716-446655440003';

  await withOrgContext(db, orgId, async (tx) => {
    await tx.execute(sql`SELECT set_config('varco.org_id', ${orgId}, true)`);
  });

  const rows = await db.execute(sql`SELECT current_setting('varco.org_id', true) AS org_id`);
  const setting = (rows as { org_id: string }[])[0]?.org_id;
  assert.ok(!setting || setting === '');
});
