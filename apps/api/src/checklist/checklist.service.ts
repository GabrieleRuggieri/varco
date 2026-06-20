/**
 * Servizio checklist — obblighi per paese derivati dalla matrice.
 * Query sempre in contesto org per RLS su checklist_items.
 */
import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import {
  checklistItems,
  obligationRules,
  products,
  skus,
  withOrgContext,
  type Database,
} from '@varco/database';
import { DATABASE } from '../database/database.module';

@Injectable()
/** Esportazione `ChecklistService` — vedi implementazione sotto. */
export class ChecklistService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Voci checklist dell'organizzazione, opzionalmente filtrate per SKU. */
  async list(organizationId: string, skuId?: string) {
    return withOrgContext(this.db, organizationId, (tx) => {
      const conditions = skuId ? [eq(checklistItems.skuId, skuId)] : [];

      return tx
        .select({
          id: checklistItems.id,
          skuId: checklistItems.skuId,
          skuCode: skus.skuCode,
          productTitle: products.title,
          country: checklistItems.country,
          status: checklistItems.status,
          obligationRuleId: checklistItems.obligationRuleId,
          obligationType: obligationRules.obligationType,
          severity: obligationRules.severity,
          regulationRef: obligationRules.regulationRef,
          checklistTemplateId: obligationRules.checklistTemplateId,
          dueAt: checklistItems.dueAt,
          updatedAt: checklistItems.updatedAt,
        })
        .from(checklistItems)
        .innerJoin(skus, eq(checklistItems.skuId, skus.id))
        .innerJoin(products, eq(skus.productId, products.id))
        .innerJoin(obligationRules, eq(checklistItems.obligationRuleId, obligationRules.id))
        .where(and(...conditions))
        .orderBy(asc(products.title), asc(skus.skuCode), asc(checklistItems.country));
    });
  }
}
