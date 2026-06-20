/**
 * Handler job document.generate — PDF GPSR + aggiornamento checklist.
 * Transazione unica con RLS via withOrgContext nel processor.
 */
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { generateDocument } from '@varco/documents';
import type { StructuredClassification } from '@varco/classification';
import {
  checklistItems,
  classificationRuns,
  documents,
  obligationRules,
  organizations,
  products,
  skus,
  type DbTransaction,
} from '@varco/database';
import {
  DOCUMENT_TEMPLATE_VERSION,
  type DocumentGenerateJobPayload,
  type DocumentTemplateId,
} from '@varco/shared';

/** Esportazione `DocumentGenerateResult` — vedi implementazione sotto. */
export type DocumentGenerateResult = {
  documentId: string;
  skuId: string;
  templateId: string;
  storageKey: string;
  version: string;
  checklistItemsUpdated: number;
};

/** Esportazione `handleDocumentGenerate` — vedi implementazione sotto. */
export async function handleDocumentGenerate(
  tx: DbTransaction,
  payload: DocumentGenerateJobPayload,
): Promise<DocumentGenerateResult> {
  const [row] = await tx
    .select({
      skuId: skus.id,
      skuCode: skus.skuCode,
      targetCountries: skus.targetCountries,
      productTitle: products.title,
      productDescription: products.description,
      materials: products.materials,
      categoryHint: products.categoryHint,
      organizationId: products.organizationId,
      organizationName: organizations.name,
    })
    .from(skus)
    .innerJoin(products, eq(skus.productId, products.id))
    .innerJoin(organizations, eq(products.organizationId, organizations.id))
    .where(eq(skus.id, payload.skuId))
    .limit(1);

  if (!row) {
    throw new Error(`SKU ${payload.skuId} non trovato per organizzazione ${payload.organizationId}`);
  }

  const [latestRun] = await tx
    .select()
    .from(classificationRuns)
    .where(eq(classificationRuns.skuId, payload.skuId))
    .orderBy(desc(classificationRuns.createdAt))
    .limit(1);

  const structured = latestRun?.structuredOutput as StructuredClassification | undefined;
  const productCategory = structured?.product_category ?? row.categoryHint ?? 'toys';
  const confidence =
    structured?.confidence ?? (latestRun?.confidence ? Number(latestRun.confidence) : undefined);

  const templateId = payload.templateId as DocumentTemplateId;
  const generated = await generateDocument({
    organizationId: payload.organizationId,
    skuId: payload.skuId,
    templateId,
    templateVersion: DOCUMENT_TEMPLATE_VERSION,
    organizationName: row.organizationName,
    skuCode: row.skuCode,
    productTitle: row.productTitle,
    productDescription: row.productDescription,
    materials: structured?.materials ?? row.materials,
    targetCountries: row.targetCountries,
    productCategory,
    classificationConfidence: confidence,
    generatedAt: new Date().toISOString(),
  });

  const [document] = await tx
    .insert(documents)
    .values({
      skuId: payload.skuId,
      templateId,
      version: generated.version,
      storageKey: generated.storageKey,
      mimeType: generated.mimeType,
      checksum: generated.checksum,
    })
    .returning();

  if (!document) {
    throw new Error('Inserimento documento fallito');
  }

  const rules = await tx
    .select({ id: obligationRules.id })
    .from(obligationRules)
    .where(eq(obligationRules.checklistTemplateId, templateId));

  const ruleIds = rules.map((r) => r.id);
  let checklistItemsUpdated = 0;

  if (ruleIds.length > 0) {
    const updated = await tx
      .update(checklistItems)
      .set({ status: 'in_progress', updatedAt: sql`now()` })
      .where(
        and(eq(checklistItems.skuId, payload.skuId), inArray(checklistItems.obligationRuleId, ruleIds)),
      )
      .returning({ id: checklistItems.id });
    checklistItemsUpdated = updated.length;
  }

  return {
    documentId: document.id,
    skuId: payload.skuId,
    templateId,
    storageKey: generated.storageKey,
    version: generated.version,
    checklistItemsUpdated,
  };
}
