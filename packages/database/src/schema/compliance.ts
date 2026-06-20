/**
 * Modulo database `compliance` — schema Drizzle e accesso PostgreSQL.
 */
import {
  index,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { checklistStatusEnum, countryCodeEnum } from './enums.js';
import { matrixVersions, obligationRules } from './matrix.js';
import { skus } from './catalog.js';

/** Esecuzione classificazione LLM — immutabile (nuova versione = nuovo record) */
export const classificationRuns = pgTable(
  'classification_runs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    skuId: uuid('sku_id')
      .notNull()
      .references(() => skus.id, { onDelete: 'cascade' }),
    matrixVersionId: uuid('matrix_version_id')
      .notNull()
      .references(() => matrixVersions.id),
    llmProvider: text('llm_provider').notNull(),
    structuredOutput: jsonb('structured_output').$type<Record<string, unknown>>().notNull(),
    confidence: numeric('confidence', { precision: 4, scale: 3 }),
    matchedRuleIds: text('matched_rule_ids').array().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('classification_runs_sku_id_idx').on(table.skuId)],
);

/** Voce checklist operativa per seller */
export const checklistItems = pgTable(
  'checklist_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    skuId: uuid('sku_id')
      .notNull()
      .references(() => skus.id, { onDelete: 'cascade' }),
    obligationRuleId: text('obligation_rule_id')
      .notNull()
      .references(() => obligationRules.id),
    country: countryCodeEnum('country').notNull(),
    status: checklistStatusEnum('status').notNull().default('open'),
    dueAt: timestamp('due_at', { withTimezone: true }),
    waivedReason: text('waived_reason'),
    classificationRunId: uuid('classification_run_id').references(() => classificationRuns.id),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('checklist_items_sku_status_idx').on(table.skuId, table.status),
    uniqueIndex('checklist_items_sku_country_rule_uidx').on(
      table.skuId,
      table.country,
      table.obligationRuleId,
    ),
  ],
);

/** Documento generato (PDF in object storage) */
export const documents = pgTable(
  'documents',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    skuId: uuid('sku_id')
      .notNull()
      .references(() => skus.id, { onDelete: 'cascade' }),
    templateId: text('template_id').notNull(),
    version: text('version').notNull(),
    storageKey: text('storage_key').notNull(),
    mimeType: text('mime_type').notNull().default('application/pdf'),
    checksum: text('checksum'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('documents_sku_id_idx').on(table.skuId)],
);
