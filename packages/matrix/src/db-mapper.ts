import type { obligationRules } from '@varco/database';
import type { ObligationRuleInput } from './schema.js';

type DbObligationRule = typeof obligationRules.$inferSelect;

/** Converte riga PostgreSQL in formato regola per `matchRules`. */
export function mapDbObligationRule(row: DbObligationRule): ObligationRuleInput {
  return {
    id: row.id,
    countries: row.countries,
    product_categories: row.productCategories,
    obligation_type: row.obligationType,
    severity: row.severity,
    regulation_ref: row.regulationRef,
    deadline_type: row.deadlineType,
    checklist_template_id: row.checklistTemplateId ?? undefined,
    document_templates: [],
    effective_from: row.effectiveFrom.toISOString().slice(0, 10),
    review_status: row.reviewStatus,
    notes: row.notes ?? undefined,
  };
}
