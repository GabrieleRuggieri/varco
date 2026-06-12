import assert from 'node:assert/strict';
import { test, before, after } from 'node:test';
import Fastify from 'fastify';
import { countSkus, loadShopifyCatalog, resetCatalogCache } from './lib/catalog.js';
import {
  createPartnerRequest,
  getPartnerRequest,
  resetPartnerStore,
} from './lib/partner-store.js';
import { registerPartnerRoutes } from './routes/partners.js';
import { registerShopifyRoutes } from './routes/shopify.js';

before(() => {
  process.env.FIXTURES_DIR = new URL('../../../fixtures', import.meta.url).pathname;
});

after(() => {
  resetCatalogCache();
  resetPartnerStore();
});

test('catalogo mock ha ~20 SKU e 5 categorie', async () => {
  const catalog = await loadShopifyCatalog();
  const skus = countSkus(catalog);
  assert.ok(skus >= 20, `attesi almeno 20 SKU, trovati ${skus}`);
  assert.equal(catalog.products.length, 20);
});

test('GET products.json restituisce prodotti', async () => {
  const app = Fastify();
  await registerShopifyRoutes(app);
  const res = await app.inject({
    method: 'GET',
    url: '/shopify/admin/api/2024-10/products.json',
  });
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body) as { products: unknown[]; meta: { total_skus: number } };
  assert.ok(body.products.length > 0);
  assert.ok(body.meta.total_skus >= 20);
  await app.close();
});

test('POST partners/rp/requests crea richiesta', async () => {
  resetPartnerStore();
  const app = Fastify();
  await registerPartnerRoutes(app);
  const res = await app.inject({
    method: 'POST',
    url: '/partners/rp/requests',
    payload: { country: 'DE', sku_id: 'test-sku' },
  });
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body) as { id: string; status: string };
  assert.equal(body.status, 'submitted');
  assert.ok(getPartnerRequest(body.id));
  await app.close();
});

test('createPartnerRequest genera external_ref', () => {
  resetPartnerStore();
  const req = createPartnerRequest({ type: 'epr_packaging', country: 'FR' });
  assert.match(req.externalRef, /^EXT-/);
});
