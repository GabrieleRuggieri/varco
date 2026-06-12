/**
 * Mock server HTTP — Shopify Admin API, OAuth simulato e partner RP/EPR.
 * Fixture: fixtures/shopify-catalog.json (~20 SKU, 5 categorie MVP).
 */
import Fastify from 'fastify';
import { countSkus, loadShopifyCatalog, resolveFixturesDir } from './lib/catalog.js';
import { registerPartnerRoutes } from './routes/partners.js';
import { registerShopifyRoutes } from './routes/shopify.js';

const port = Number(process.env.PORT ?? 4010);
const host = '0.0.0.0';

const app = Fastify({ logger: true });

app.get('/health', async () => {
  let catalogStats = { products: 0, skus: 0 };
  try {
    const catalog = await loadShopifyCatalog();
    catalogStats = { products: catalog.products.length, skus: countSkus(catalog) };
  } catch {
    catalogStats = { products: 0, skus: 0 };
  }
  return {
    status: 'ok',
    service: '@varco/mock-server',
    fixtures_dir: resolveFixturesDir(),
    catalog: catalogStats,
    modes: { shopify: 'mock', amazon: 'mock', partners: 'mock' },
  };
});

await registerShopifyRoutes(app);
await registerPartnerRoutes(app);

/** Amazon SP-API — stub per fase connettori */
app.get('/amazon/sp-api/catalog', async () => ({
  items: [],
  note: 'Amazon mock — implementazione in fase connettori live',
}));

const start = async () => {
  try {
    await app.listen({ port, host });
    console.log(`[mock-server] in ascolto su http://localhost:${port}`);
    console.log(`[mock-server] fixture: ${resolveFixturesDir()}/shopify-catalog.json`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
