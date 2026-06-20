/**
 * Modulo database `matrix` — schema Drizzle e accesso PostgreSQL.
 */
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import {
  countryCodeEnum,
  matrixReviewStatusEnum,
  obligationTypeEnum,
  productCategoryEnum,
  severityLevelEnum,
} from './enums.js';

/** Versione deployata della matrice obblighi (hash bundle YAML) */
export const matrixVersions = pgTable('matrix_versions', {
  id: uuid('id').primaryKey().defaultRandom(),
  versionLabel: text('version_label').notNull(),
  contentHash: text('content_hash').notNull().unique(),
  deployedAt: timestamp('deployed_at', { withTimezone: true }).notNull().defaultNow(),
  deployedBy: text('deployed_by'),
});

/** Regola obbligo materializzata per query veloci */
export const obligationRules = pgTable(
  'obligation_rules',
  {
    id: text('id').primaryKey(),
    matrixVersionId: uuid('matrix_version_id')
      .notNull()
      .references(() => matrixVersions.id, { onDelete: 'cascade' }),
    countries: countryCodeEnum('countries').array().notNull(),
    productCategories: productCategoryEnum('product_categories').array().notNull(),
    obligationType: obligationTypeEnum('obligation_type').notNull(),
    severity: severityLevelEnum('severity').notNull(),
    regulationRef: text('regulation_ref').notNull(),
    deadlineType: text('deadline_type').notNull(),
    checklistTemplateId: text('checklist_template_id'),
    effectiveFrom: timestamp('effective_from', { withTimezone: true }).notNull(),
    reviewStatus: matrixReviewStatusEnum('review_status').notNull().default('bozza'),
    reviewedBy: text('reviewed_by'),
    reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
    notes: text('notes'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('obligation_rules_matrix_version_idx').on(table.matrixVersionId),
    index('obligation_rules_review_status_idx').on(table.reviewStatus),
  ],
);

/** Audit modifiche alla matrice */
export const ruleChangeLogs = pgTable('rule_change_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  ruleId: text('rule_id')
    .notNull()
    .references(() => obligationRules.id, { onDelete: 'cascade' }),
  changeType: text('change_type').notNull(),
  changedBy: text('changed_by').notNull(),
  summary: text('summary').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
