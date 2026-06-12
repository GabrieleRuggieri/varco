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
  type Database,
} from '@varco/database';
import {
  DOCUMENT_TEMPLATE_VERSION,
  type DocumentGenerateJobPayload,
  type DocumentTemplateId,
} from '@varco/shared';

export type DocumentGenerateResult = {
  documentId: string;
  skuId: string;
  templateId: string;
  storageKey: string;
  version: string;
  checklistItemsUpdated: number;
};

export async function handleDocumentGenerate(
  db: Database,
  payload: DocumentGenerateJobPayload,
): Promise<DocumentGenerateResult> {
  const [row] = await db
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
    .where(and(eq(skus.id, payload.skuId), eq(products.organizationId, payload.organizationId)))
    .limit(1);

  if (!row) {
    throw new Error(`SKU ${payload.skuId} non trovato per organizzazione ${payload.organizationId}`);
  }

  const [latestRun] = await db
    .select()
    .from(classificationRuns)
    .where(eq(classificationRuns.skuId, payload.skuId))
    .orderBy(desc(classificationRuns.createdAt))
    .limit(1);

  const structured = latestRun?.structuredOutput as StructuredClassification | undefined;
  const productCategory =
    structured?.product_category ?? row.categoryHint ?? 'toys';
  const confidence = structured?.confidence ?? (latestRun?.confidence ? Number(latestRun.confidence) : undefined);

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

  return db.transaction(async (tx) => {
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
          and(
            eq(checklistItems.skuId, payload.skuId),
            inArray(checklistItems.obligationRuleId, ruleIds),
          ),
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
  });
}
