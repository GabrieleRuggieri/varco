import { and, eq } from 'drizzle-orm';
import { products, skus, type Database } from '@varco/database';
import type { SkuClassifyJobPayload } from '@varco/shared';

export type SkuClassifyResult = {
  skuId: string;
  status: 'queued_for_phase_9';
  message: string;
};

/**
 * Placeholder classificazione — logica LLM + matrice in fase 9.
 * Verifica che lo SKU esista e appartenga all'organizzazione.
 */
export async function handleSkuClassify(
  db: Database,
  payload: SkuClassifyJobPayload,
): Promise<SkuClassifyResult> {
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
    status: 'queued_for_phase_9',
    message: 'Classificazione mock/LLM implementata in fase 9',
  };
}
