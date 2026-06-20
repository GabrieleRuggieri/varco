/**
 * Mock `partners` — simulazione servizi esterni per sviluppo locale.
 */
import type { FastifyInstance } from 'fastify';
import {
  createPartnerRequest,
  getPartnerRequest,
  listPartnerRequests,
  listWebhookEvents,
  type PartnerRequestType,
} from '../lib/partner-store.js';
import { schedulePartnerWebhook } from '../lib/webhook-simulator.js';

type PartnerBody = {
  country: string;
  sku_id?: string;
};

/** Route partner RP / EPR mock */
export async function registerPartnerRoutes(app: FastifyInstance): Promise<void> {
  const handleCreate =
    (type: PartnerRequestType) =>
    async (
      body: PartnerBody,
      reply: { code: (n: number) => { send: (p: unknown) => unknown } },
    ) => {
      if (!body?.country || body.country.length !== 2) {
        return reply.code(400).send({ error: 'country obbligatorio (ISO 3166-1 alpha-2)' });
      }
      const request = createPartnerRequest({
        type,
        country: body.country.toUpperCase(),
        skuId: body.sku_id,
      });
      schedulePartnerWebhook(request);
      return {
        id: request.id,
        external_ref: request.externalRef,
        status: request.status,
        type: request.type,
        country: request.country,
        message: `Richiesta accettata — webhook simulato tra ${process.env.PARTNER_WEBHOOK_DELAY_MS ?? 5000}ms`,
      };
    };

  app.post<{ Body: PartnerBody }>('/partners/rp/requests', async (request, reply) => {
    return handleCreate('rp')(request.body, reply);
  });

  app.post<{ Body: PartnerBody }>('/partners/epr/requests', async (request, reply) => {
    return handleCreate('epr_packaging')(request.body, reply);
  });

  app.get('/partners/requests', async () => ({
    requests: listPartnerRequests(),
  }));

  app.get('/partners/requests/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const req = getPartnerRequest(id);
    if (!req) {
      return reply.code(404).send({ error: `Richiesta partner ${id} non trovata` });
    }
    return { request: req };
  });

  /** Log eventi webhook (audit locale finché l'API Varco non espone l'endpoint) */
  app.get('/partners/webhook-events', async () => ({
    events: listWebhookEvents(),
  }));
}
