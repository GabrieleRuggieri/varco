import { and, eq, sql } from 'drizzle-orm';
import { classifySku } from '@varco/classification';
import { checklistItems, classificationRuns, products, skus, type Database } from '@varco/database';
import { loadLatestMatrixRules, matchRules } from '@varco/matrix';
import type { SkuClassifyJobPayload } from '@varco/shared';
import type { ChecklistStatus } from '@varco/shared';

const CONFIDENCE_REVIEW_THRESHOLD = 0.7;

export type SkuClassifyResult = {
  skuId: string;
  classificationRunId: string;
  matchedRules: number;
  checklistItemsUpserted: number;
  confidence: number;
};

export async function handleSkuClassify(
  db: Database,
  payload: SkuClassifyJobPayload,
): Promise<SkuClassifyResult> {
  const [skuRow] = await db
    .select({
      skuId: skus.id,
      skuCode: skus.skuCode,
      targetCountries: skus.targetCountries,
      productTitle: products.title,
      productDescription: products.description,
      categoryHint: products.categoryHint,
      materials: products.materials,
    })
    .from(skus)
    .innerJoin(products, eq(skus.productId, products.id))
    .where(and(eq(skus.id, payload.skuId), eq(products.organizationId, payload.organizationId)))
    .limit(1);

  if (!skuRow) {
    throw new Error(
      `SKU ${payload.skuId} non trovato per organizzazione ${payload.organizationId}`,
    );
  }

  const classification = await classifySku({
    skuCode: skuRow.skuCode,
    productTitle: skuRow.productTitle,
    productDescription: skuRow.productDescription,
    categoryHint: skuRow.categoryHint,
    materials: skuRow.materials,
  });

  const { versionId, rules } = await loadLatestMatrixRules(db);
  const matched = matchRules(rules, {
    product_category: classification.product_category,
    target_countries: skuRow.targetCountries,
  });

  const checklistStatus: ChecklistStatus =
    classification.confidence < CONFIDENCE_REVIEW_THRESHOLD ? 'needs_review' : 'open';

  return db.transaction(async (tx) => {
    const [run] = await tx
      .insert(classificationRuns)
      .values({
        skuId: payload.skuId,
        matrixVersionId: versionId,
        llmProvider: process.env.LLM_PROVIDER ?? 'mock',
        structuredOutput: classification,
        confidence: String(classification.confidence),
        matchedRuleIds: matched.map((r) => r.id),
      })
      .returning();

    if (!run) {
      throw new Error('Inserimento classification_run fallito');
    }

    const checklistRows = matched.flatMap((rule) =>
      rule.countries
        .filter((country) => skuRow.targetCountries.includes(country))
        .map((country) => ({
          skuId: payload.skuId,
          obligationRuleId: rule.id,
          country,
          status: checklistStatus,
          classificationRunId: run.id,
        })),
    );

    if (checklistRows.length > 0) {
      await tx
        .insert(checklistItems)
        .values(checklistRows)
        .onConflictDoUpdate({
          target: [checklistItems.skuId, checklistItems.country, checklistItems.obligationRuleId],
          set: {
            status: checklistStatus,
            classificationRunId: run.id,
            updatedAt: sql`now()`,
          },
        });
    }

    return {
      skuId: payload.skuId,
      classificationRunId: run.id,
      matchedRules: matched.length,
      checklistItemsUpserted: checklistRows.length,
      confidence: classification.confidence,
    };
  });
}
