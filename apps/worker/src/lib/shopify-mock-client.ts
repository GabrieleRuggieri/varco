/**
 * Modulo worker `shopify-mock-client` — job asincroni BullMQ.
 */
import { getMockServerUrl } from '../config.js';

const SHOPIFY_API_VERSION = '2024-10';

/** Esportazione `ShopifyVariant` — vedi implementazione sotto. */
export type ShopifyVariant = {
  id: number;
  product_id: number;
  sku: string;
  title: string;
  price: string;
};

/** Esportazione `ShopifyProduct` — vedi implementazione sotto. */
export type ShopifyProduct = {
  id: number;
  title: string;
  body_html: string;
  tags: string;
  variants: ShopifyVariant[];
  images: { src: string }[];
};

type ProductsResponse = {
  products: ShopifyProduct[];
  meta?: { has_more?: boolean };
};

/** Scarica tutti i prodotti dal mock server Shopify (paginazione semplice). */
export async function fetchAllMockShopifyProducts(): Promise<ShopifyProduct[]> {
  const baseUrl = getMockServerUrl();
  const products: ShopifyProduct[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `${baseUrl}/shopify/admin/api/${SHOPIFY_API_VERSION}/products.json?limit=50&page=${page}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mock Shopify API ${response.status}: ${await response.text()}`);
    }
    const body = (await response.json()) as ProductsResponse;
    products.push(...body.products);
    hasMore = body.meta?.has_more ?? false;
    page += 1;
  }

  return products;
}
