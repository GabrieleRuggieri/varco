import { Inject, Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { checklistItems, obligationRules, products, skus, type Database } from '@varco/database';
import { DATABASE } from '../database/database.module';

@Injectable()
export class ChecklistService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  async list(organizationId: string, skuId?: string) {
    const conditions = [eq(products.organizationId, organizationId)];
    if (skuId) {
      conditions.push(eq(checklistItems.skuId, skuId));
    }

    return this.db
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
  }
}
