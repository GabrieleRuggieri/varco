import { index, jsonb, pgTable, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';
import { catalogProviderEnum, countryCodeEnum, productCategoryEnum } from './enums.js';
import { organizations } from './organizations.js';

/** Connessione a marketplace (Shopify, Amazon) */
export const catalogConnections = pgTable(
  'catalog_connections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    provider: catalogProviderEnum('provider').notNull(),
    /** Riferimento a credenziali cifrate (vault/env) — non il token in chiaro */
    credentialsRef: text('credentials_ref'),
    externalShopId: text('external_shop_id'),
    lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('catalog_connections_org_id_idx').on(table.organizationId),
    uniqueIndex('catalog_connections_org_provider_uidx').on(
      table.organizationId,
      table.provider,
    ),
  ],
);

/** Prodotto normalizzato dal catalogo esterno */
export const products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    organizationId: uuid('organization_id')
      .notNull()
      .references(() => organizations.id, { onDelete: 'cascade' }),
    externalId: text('external_id').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    materials: jsonb('materials').$type<string[]>().notNull().default([]),
    images: jsonb('images').$type<string[]>().notNull().default([]),
    categoryHint: productCategoryEnum('category_hint'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('products_org_id_idx').on(table.organizationId),
    uniqueIndex('products_org_external_uidx').on(table.organizationId, table.externalId),
  ],
);

/** Variante / SKU a catalogo */
export const skus = pgTable(
  'skus',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id')
      .notNull()
      .references(() => products.id, { onDelete: 'cascade' }),
    skuCode: text('sku_code').notNull(),
    variantAttrs: jsonb('variant_attrs').$type<Record<string, string>>().notNull().default({}),
    targetCountries: countryCodeEnum('target_countries').array().notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('skus_product_id_idx').on(table.productId),
    uniqueIndex('skus_product_sku_code_uidx').on(table.productId, table.skuCode),
  ],
);
