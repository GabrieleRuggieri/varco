import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { countryCodeEnum, partnerRequestStatusEnum, partnerRequestTypeEnum } from './enums.js';
import { organizations } from './organizations.js';
import { skus } from './catalog.js';

/** Richiesta a partner RP o EPR */
export const partnerRequests = pgTable(
  'partner_requests',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    skuId: uuid('sku_id').references(() => skus.id, { onDelete: 'set null' }),
    type: partnerRequestTypeEnum('type').notNull(),
    country: countryCodeEnum('country').notNull(),
    status: partnerRequestStatusEnum('status').notNull().default('draft'),
    externalRef: text('external_ref'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('partner_requests_org_id_idx').on(table.organizationId),
    index('partner_requests_status_idx').on(table.status),
  ],
);

/** Evento webhook partner — audit trail */
export const partnerWebhookEvents = pgTable('partner_webhook_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  partnerRequestId: uuid('partner_request_id').references(() => partnerRequests.id, {
    onDelete: 'set null',
  }),
  payload: jsonb('payload').$type<Record<string, unknown>>().notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).notNull().defaultNow(),
});
