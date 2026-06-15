/**
 * Popola il flusso demo completo (richiede worker attivo):
 * 1. Sync catalogo · 2. Classifica SKU · 3. Checklist · 4. PDF risk assessment
 */
import { eq } from 'drizzle-orm';
import { createDb, checklistItems, documents, organizations, skus } from '@varco/database';
import {
  closeVarcoQueue,
  enqueueCatalogSync,
  enqueueDocumentGenerate,
  enqueueSkuClassify,
} from '@varco/queue';

const DEMO_ORG_NAME = 'Varco Demo';
const MAX_CLASSIFY = 8;
const MAX_PDF = 3;
const POLL_MS = 2000;
const SYNC_TIMEOUT_MS = 90_000;
const CLASSIFY_TIMEOUT_MS = 120_000;
const PDF_TIMEOUT_MS = 120_000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function assertMockCatalogReady(): Promise<void> {
  const baseUrl = process.env.MOCK_SERVER_URL ?? 'http://localhost:4010';
  const url = `${baseUrl}/shopify/admin/api/2024-10/products.json?limit=1`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    const body = (await res.json()) as { products?: unknown[] };
    if (!body.products?.length) {
      throw new Error('catalogo vuoto');
    }
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`[demo:populate] Mock Shopify non pronto (${reason}).`);
    console.error(
      '[demo:populate] Esegui: docker compose build mock-server && docker compose up -d mock-server',
    );
    process.exit(1);
  }
}

async function waitFor(
  label: string,
  check: () => Promise<boolean>,
  timeoutMs: number,
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await check()) {
      console.log(`[demo:populate] ✓ ${label}`);
      return true;
    }
    await sleep(POLL_MS);
  }
  console.warn(`[demo:populate] ✗ ${label} — timeout dopo ${timeoutMs}ms`);
  return false;
}

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

  await assertMockCatalogReady();

  console.log('[demo:populate] 1/4 — Sincronizza catalogo (mock Shopify)…');
  await enqueueCatalogSync({ organizationId: org.id }, { force: true });

  const synced = await waitFor(
    'Catalogo con SKU',
    async () => {
      const rows = await db.select({ id: skus.id }).from(skus).limit(1);
      return rows.length > 0;
    },
    SYNC_TIMEOUT_MS,
  );

  if (!synced) {
    console.error('[demo:populate] Avvia il worker: pnpm dev');
    await closeVarcoQueue();
    process.exit(1);
  }

  const skuRows = await db.select({ id: skus.id }).from(skus).limit(MAX_CLASSIFY);
  console.log(`[demo:populate] 2/4 — Classifica ${skuRows.length} SKU…`);

  for (const row of skuRows) {
    await enqueueSkuClassify({ organizationId: org.id, skuId: row.id });
  }

  const classified = await waitFor(
    'Checklist obblighi',
    async () => {
      const rows = await db.select({ id: checklistItems.id }).from(checklistItems).limit(1);
      return rows.length > 0;
    },
    CLASSIFY_TIMEOUT_MS,
  );

  if (!classified) {
    console.error('[demo:populate] Classificazione non completata — worker attivo?');
    await closeVarcoQueue();
    process.exit(1);
  }

  const pdfSkus = skuRows.slice(0, MAX_PDF);
  console.log(`[demo:populate] 4/4 — Genera PDF per ${pdfSkus.length} SKU…`);

  for (const row of pdfSkus) {
    await enqueueDocumentGenerate({
      organizationId: org.id,
      skuId: row.id,
      templateId: 'risk_assessment',
    });
  }

  await waitFor(
    'Documenti PDF',
    async () => {
      const rows = await db.select({ id: documents.id }).from(documents).limit(1);
      return rows.length > 0;
    },
    PDF_TIMEOUT_MS,
  );

  const checklistCount = await db.select({ id: checklistItems.id }).from(checklistItems);
  const docCount = await db.select({ id: documents.id }).from(documents);

  await closeVarcoQueue();
  console.log('[demo:populate] Completato — apri http://localhost:3000');
  console.log(
    `  SKU: ${skuRows.length} · Checklist: ${checklistCount.length} · PDF: ${docCount.length}`,
  );
  process.exit(0);
};

run().catch(async (err) => {
  console.error('[demo:populate] Errore:', err);
  await closeVarcoQueue().catch(() => undefined);
  process.exit(1);
});
