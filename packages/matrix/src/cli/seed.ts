/**
 * CLI: importa matrice validata in PostgreSQL.
 * Uso: pnpm matrix:seed [percorso-file]
 */
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { createDb, matrixVersions, obligationRules } from '@varco/database';
import { loadMatrixBundle, DEFAULT_MATRIX_PATH } from '../load.js';
import { hashMatrixBundle } from '../hash.js';

const filePath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_MATRIX_PATH;

const run = async () => {
  const bundle = await loadMatrixBundle(filePath);
  const contentHash = hashMatrixBundle(bundle);
  const db = createDb();

  const existing = await db
    .select()
    .from(matrixVersions)
    .where(eq(matrixVersions.contentHash, contentHash))
    .limit(1);

  if (existing.length > 0) {
    console.log('[matrix:seed] Bundle già presente — hash', contentHash.slice(0, 12));
    process.exit(0);
  }

  const [version] = await db
    .insert(matrixVersions)
    .values({
      versionLabel: bundle.version,
      contentHash,
      deployedBy: 'matrix:seed',
    })
    .returning();

  if (!version) {
    throw new Error('Inserimento matrix_versions fallito');
  }

  await db.insert(obligationRules).values(
    bundle.rules.map((rule) => ({
      id: rule.id,
      matrixVersionId: version.id,
      countries: rule.countries,
      productCategories: rule.product_categories,
      obligationType: rule.obligation_type,
      severity: rule.severity,
      regulationRef: rule.regulation_ref,
      deadlineType: rule.deadline_type,
      checklistTemplateId: rule.checklist_template_id ?? null,
      effectiveFrom: new Date(rule.effective_from),
      reviewStatus: rule.review_status,
      notes: rule.notes ?? null,
    })),
  );

  console.log('[matrix:seed] Import completato');
  console.log(`  versione: ${bundle.version} (${version.id})`);
  console.log(`  regole: ${bundle.rules.length}`);
  console.log(`  hash: ${contentHash.slice(0, 16)}...`);
  console.log(
    `  stato: ${bundle.rules.filter((r) => r.review_status === 'bozza').length} regole in bozza`,
  );
  process.exit(0);
};

run().catch((err) => {
  console.error('[matrix:seed] Errore:', err);
  process.exit(1);
});
