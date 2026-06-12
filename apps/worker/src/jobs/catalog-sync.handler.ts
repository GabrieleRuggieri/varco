import { and, eq } from 'drizzle-orm';
import {
  catalogConnections,
  products,
  skus,
  type Database,
} from '@varco/database';
import type { CatalogSyncJobPayload } from '@varco/shared';
import { parseShopifyTags } from '../lib/parse-shopify-tags.js';
import { fetchAllMockShopifyProducts } from '../lib/shopify-mock-client.js';

export type CatalogSyncResult = {
  productsUpserted: number;
  skusUpserted: number;
  connectionId: string;
};

export async function handleCatalogSync(
  db: Database,
  payload: CatalogSyncJobPayload,
): Promise<CatalogSyncResult> {
  const connection = await resolveConnection(db, payload);
  if (connection.provider !== 'shopify') {
    throw new Error(`Provider ${connection.provider} non ancora supportato nel worker`);
  }

  const shopifyProducts = await fetchAllMockShopifyProducts();
  let productsUpserted = 0;
  let skusUpserted = 0;

  for (const item of shopifyProducts) {
    const parsed = parseShopifyTags(item.tags);
    const images = item.images.map((img) => img.src);

    const [product] = await db
      .insert(products)
      .values({
        organizationId: connection.organizationId,
        externalId: String(item.id),
        title: item.title,
        description: stripHtml(item.body_html),
        materials: parsed.materials,
        images,
        categoryHint: parsed.categoryHint ?? undefined,
      })
      .onConflictDoUpdate({
        target: [products.organizationId, products.externalId],
        set: {
          title: item.title,
          description: stripHtml(item.body_html),
          materials: parsed.materials,
          images,
          categoryHint: parsed.categoryHint ?? undefined,
          updatedAt: new Date(),
        },
      })
      .returning();

    if (!product) continue;
    productsUpserted += 1;

    for (const variant of item.variants) {
      if (!variant.sku) continue;

      await db
        .insert(skus)
        .values({
          productId: product.id,
          skuCode: variant.sku,
          variantAttrs: { title: variant.title, price: variant.price },
          targetCountries: parsed.targetCountries,
        })
        .onConflictDoUpdate({
          target: [skus.productId, skus.skuCode],
          set: {
            variantAttrs: { title: variant.title, price: variant.price },
            targetCountries: parsed.targetCountries,
            updatedAt: new Date(),
          },
        });

      skusUpserted += 1;
    }
  }

  await db
    .update(catalogConnections)
    .set({ lastSyncAt: new Date(), updatedAt: new Date() })
    .where(eq(catalogConnections.id, connection.id));

  return {
    productsUpserted,
    skusUpserted,
    connectionId: connection.id,
  };
}

async function resolveConnection(db: Database, payload: CatalogSyncJobPayload) {
  if (payload.connectionId) {
    const [row] = await db
      .select()
      .from(catalogConnections)
      .where(
        and(
          eq(catalogConnections.id, payload.connectionId),
          eq(catalogConnections.organizationId, payload.organizationId),
        ),
      )
      .limit(1);
    if (!row) {
      throw new Error(`Connessione catalogo ${payload.connectionId} non trovata`);
    }
    return row;
  }

  const [existing] = await db
    .select()
    .from(catalogConnections)
    .where(
      and(
        eq(catalogConnections.organizationId, payload.organizationId),
        eq(catalogConnections.provider, 'shopify'),
      ),
    )
    .limit(1);

  if (existing) return existing;

  const [created] = await db
    .insert(catalogConnections)
    .values({
      organizationId: payload.organizationId,
      provider: 'shopify',
      externalShopId: 'varco-demo.myshopify.com',
      credentialsRef: 'mock',
    })
    .returning();

  if (!created) {
    throw new Error('Impossibile creare connessione catalogo Shopify demo');
  }
  return created;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}
