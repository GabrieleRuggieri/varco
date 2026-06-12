/**
 * Mock server HTTP — fase 2.
 * Espone health check e stub per Shopify/partner; le fixture complete
 * arriveranno nella fase connettori catalogo.
 */
import Fastify from 'fastify';

const port = Number(process.env.PORT ?? 4010);
const host = '0.0.0.0';

const app = Fastify({ logger: true });

app.get('/health', async () => ({
  status: 'ok',
  service: '@varco/mock-server',
  modes: {
    shopify: 'mock',
    amazon: 'mock',
    partners: 'mock',
  },
}));

/** Stub OAuth Shopify — redirect simulato in fase connettori */
app.get('/shopify/oauth/authorize', async () => ({
  message: 'OAuth Shopify mock — implementazione completa in fase connettori',
}));

/** Stub catalogo Shopify Admin API */
app.get('/shopify/admin/api/2024-10/products.json', async () => ({
  products: [],
  note: 'Fixture catalogo in fixtures/shopify-catalog.json — fase connettori',
}));

/** Stub partner RP — conferma attivazione simulata */
app.post('/partners/rp/requests', async () => ({
  id: 'mock-rp-001',
  status: 'processing',
  message: 'Partner mock — webhook simulato dopo 5s in fase partner broker',
}));

const start = async () => {
  try {
    await app.listen({ port, host });
    console.log(`[mock-server] in ascolto su http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

void start();
