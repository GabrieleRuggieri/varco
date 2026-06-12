import type { FastifyInstance } from 'fastify';
import { countSkus, loadShopifyCatalog } from '../lib/catalog.js';

const API_VERSION = '2024-10';

/** Route Shopify Admin API mock */
export async function registerShopifyRoutes(app: FastifyInstance): Promise<void> {
  /** OAuth authorize — redirect simulato verso callback con code finto */
  app.get('/shopify/oauth/authorize', async (request) => {
    const query = request.query as { redirect_uri?: string; state?: string };
    const redirectUri = query.redirect_uri ?? 'http://localhost:3000/api/auth/callback/shopify';
    const state = query.state ?? 'mock-state';
    const code = 'mock-auth-code-varco-demo';
    const url = `${redirectUri}?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`;
    return {
      message: 'OAuth Shopify mock — usa redirect_url per completare il flusso',
      redirect_url: url,
      shop: 'varco-demo.myshopify.com',
    };
  });

  /** Scambio code → token (mock) */
  app.post('/shopify/oauth/access_token', async () => ({
    access_token: 'shpat_mock_varco_demo_token',
    scope: 'read_products,read_inventory',
    expires_in: null,
  }));

  /** Info negozio */
  app.get(`/shopify/admin/api/${API_VERSION}/shop.json`, async () => ({
    shop: {
      id: 7001001,
      name: 'Varco Demo Shop',
      email: 'demo@varco.local',
      domain: 'varco-demo.myshopify.com',
      myshopify_domain: 'varco-demo.myshopify.com',
      country_code: 'IT',
      currency: 'EUR',
    },
  }));

  /** Lista prodotti con paginazione opzionale */
  app.get(`/shopify/admin/api/${API_VERSION}/products.json`, async (request) => {
    const query = request.query as { limit?: string; page?: string };
    const limit = Math.min(Number(query.limit ?? 50), 250);
    const page = Number(query.page ?? 1);
    const catalog = await loadShopifyCatalog();
    const start = (page - 1) * limit;
    const products = catalog.products.slice(start, start + limit);

    return {
      products,
      meta: {
        total_products: catalog.products.length,
        total_skus: countSkus(catalog),
        page,
        limit,
        has_more: start + limit < catalog.products.length,
      },
    };
  });

  /** Singolo prodotto */
  app.get(`/shopify/admin/api/${API_VERSION}/products/:id.json`, async (request, reply) => {
    const { id } = request.params as { id: string };
    const catalog = await loadShopifyCatalog();
    const product = catalog.products.find((p) => String(p.id) === id);
    if (!product) {
      return reply.code(404).send({ error: `Prodotto ${id} non trovato nel catalogo mock` });
    }
    return { product };
  });

  /** Conteggio rapido per health/diagnostica */
  app.get('/shopify/catalog/stats', async () => {
    const catalog = await loadShopifyCatalog();
    const categories = new Set<string>();
    for (const p of catalog.products) {
      const tag = p.tags
        .split(',')
        .map((t) => t.trim())
        .find((t) => t.startsWith('varco_category:'));
      if (tag) categories.add(tag.replace('varco_category:', ''));
    }
    return {
      products: catalog.products.length,
      skus: countSkus(catalog),
      categories: [...categories],
    };
  });
}
