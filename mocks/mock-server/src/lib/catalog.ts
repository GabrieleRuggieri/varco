import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Prodotto Shopify Admin API (subset usato da Varco) */
export type ShopifyProduct = {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  tags: string;
  status: string;
  variants: ShopifyVariant[];
  images: { src: string }[];
};

export type ShopifyVariant = {
  id: number;
  product_id: number;
  sku: string;
  title: string;
  price: string;
  inventory_quantity: number;
};

export type ShopifyCatalog = {
  products: ShopifyProduct[];
};

let cachedCatalog: ShopifyCatalog | null = null;

/** Risolve la directory fixture (env, Docker mount o repo root) */
export function resolveFixturesDir(): string {
  if (process.env.FIXTURES_DIR) {
    return process.env.FIXTURES_DIR;
  }
  return path.resolve(__dirname, '..', '..', '..', '..', 'fixtures');
}

/** Carica il catalogo Shopify mock da fixtures/shopify-catalog.json */
export async function loadShopifyCatalog(): Promise<ShopifyCatalog> {
  if (cachedCatalog) {
    return cachedCatalog;
  }
  const filePath = path.join(resolveFixturesDir(), 'shopify-catalog.json');
  const raw = await readFile(filePath, 'utf8');
  cachedCatalog = JSON.parse(raw) as ShopifyCatalog;
  return cachedCatalog;
}

/** Conta varianti (SKU) nel catalogo */
export function countSkus(catalog: ShopifyCatalog): number {
  return catalog.products.reduce((sum, p) => sum + p.variants.length, 0);
}

/** Reset cache — utile nei test */
export function resetCatalogCache(): void {
  cachedCatalog = null;
}
