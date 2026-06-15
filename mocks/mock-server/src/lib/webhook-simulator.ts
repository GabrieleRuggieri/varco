import {
  getPartnerRequest,
  recordWebhookEvent,
  updatePartnerRequestStatus,
  type PartnerRequest,
} from './partner-store.js';

const DEFAULT_DELAY_MS = 5000;

/**
 * Simula il partner che processa la richiesta e invia un webhook dopo un delay.
 * Se VARCO_WEBHOOK_URL è impostato, effettua POST; altrimenti registra solo il log locale.
 */
export function schedulePartnerWebhook(request: PartnerRequest): void {
  const delayMs = Number(process.env.PARTNER_WEBHOOK_DELAY_MS ?? DEFAULT_DELAY_MS);
  const targetUrl = process.env.VARCO_WEBHOOK_URL ?? null;

  setTimeout(() => {
    updatePartnerRequestStatus(request.id, 'processing');
    void deliverWebhook(request.id, targetUrl);
  }, delayMs);
}

async function deliverWebhook(requestId: string, targetUrl: string | null): Promise<void> {
  const request = getPartnerRequest(requestId);
  if (!request) return;

  updatePartnerRequestStatus(requestId, 'active');

  const payload = {
    event: 'partner.request.updated',
    partner_request_id: request.id,
    external_ref: request.externalRef,
    type: request.type,
    country: request.country,
    status: 'active' as const,
    sku_id: request.skuId ?? null,
    occurred_at: new Date().toISOString(),
  };

  if (targetUrl) {
    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Varco-Mock-Partner': 'true',
          ...(process.env.PARTNER_WEBHOOK_SECRET
            ? { 'X-Varco-Webhook-Secret': process.env.PARTNER_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify(payload),
      });
      recordWebhookEvent({
        partnerRequestId: requestId,
        deliveredAt: new Date().toISOString(),
        targetUrl,
        payload: { ...payload, http_status: res.status },
      });
    } catch (err) {
      recordWebhookEvent({
        partnerRequestId: requestId,
        deliveredAt: new Date().toISOString(),
        targetUrl,
        payload: { ...payload, error: String(err) },
      });
    }
  } else {
    recordWebhookEvent({
      partnerRequestId: requestId,
      deliveredAt: new Date().toISOString(),
      targetUrl: null,
      payload,
    });
  }
}
