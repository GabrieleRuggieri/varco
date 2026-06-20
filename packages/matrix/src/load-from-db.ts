/**
 * Package condiviso `load-from-db` — logica riusabile nel monorepo Varco.
 */
import { desc, eq } from 'drizzle-orm';
import { type Database, type DbTransaction, matrixVersions, obligationRules } from '@varco/database';
import { mapDbObligationRule } from './db-mapper.js';
import type { ObligationRuleInput } from './schema.js';

/** Esportazione `LoadedMatrixRules` — vedi implementazione sotto. */
export type LoadedMatrixRules = {
  versionId: string;
  versionLabel: string;
  rules: ObligationRuleInput[];
};

/** Client DB o transazione — stessa API query Drizzle. */
type MatrixDb = Database | DbTransaction;

/** Carica l'ultima versione matrice deployata e le regole associate. */
export async function loadLatestMatrixRules(db: MatrixDb): Promise<LoadedMatrixRules> {
  const [version] = await db
    .select()
    .from(matrixVersions)
    .orderBy(desc(matrixVersions.deployedAt))
    .limit(1);

  if (!version) {
    throw new Error('Nessuna versione matrice in database — esegui pnpm matrix:seed');
  }

  const rows = await db
    .select()
    .from(obligationRules)
    .where(eq(obligationRules.matrixVersionId, version.id));

  return {
    versionId: version.id,
    versionLabel: version.versionLabel,
    rules: rows.map(mapDbObligationRule),
  };
}
