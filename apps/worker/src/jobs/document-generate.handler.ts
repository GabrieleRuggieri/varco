import { and, eq } from 'drizzle-orm';
import { products, skus, type Database } from '@varco/database';
import type { DocumentGenerateJobPayload } from '@varco/shared';

export type DocumentGenerateResult = {
  skuId: string;
  templateId: string;
  status: 'queued_for_phase_10';
  message: string;
};

/**
 * Placeholder generazione documenti — template PDF + MinIO in fase 10.
 */
export async function handleDocumentGenerate(
  db: Database,
  payload: DocumentGenerateJobPayload,
): Promise<DocumentGenerateResult> {
  const [row] = await db
    .select({ skuId: skus.id })
    .from(skus)
    .innerJoin(products, eq(skus.productId, products.id))
    .where(and(eq(skus.id, payload.skuId), eq(products.organizationId, payload.organizationId)))
    .limit(1);

  if (!row) {
    throw new Error(`SKU ${payload.skuId} non trovato per organizzazione ${payload.organizationId}`);
  }

  return {
    skuId: payload.skuId,
    templateId: payload.templateId,
    status: 'queued_for_phase_10',
    message: 'Generazione PDF implementata in fase 10',
  };
}
