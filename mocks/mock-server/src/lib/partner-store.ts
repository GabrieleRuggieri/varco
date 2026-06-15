/**
 * Store in-memory per richieste partner RP/EPR e log webhook simulati.
 */

export type PartnerRequestType = 'rp' | 'epr_packaging';
export type PartnerRequestStatus = 'draft' | 'submitted' | 'processing' | 'active' | 'rejected';

export type PartnerRequest = {
  id: string;
  type: PartnerRequestType;
  country: string;
  skuId?: string;
  status: PartnerRequestStatus;
  externalRef: string;
  createdAt: string;
  updatedAt: string;
};

export type PartnerWebhookEvent = {
  id: string;
  partnerRequestId: string;
  deliveredAt: string;
  targetUrl: string | null;
  payload: Record<string, unknown>;
};

const requests = new Map<string, PartnerRequest>();
const webhookEvents: PartnerWebhookEvent[] = [];
let idCounter = 1;

export function createPartnerRequest(input: {
  type: PartnerRequestType;
  country: string;
  skuId?: string;
}): PartnerRequest {
  const id = `mock-partner-${String(idCounter++).padStart(4, '0')}`;
  const now = new Date().toISOString();
  const request: PartnerRequest = {
    id,
    type: input.type,
    country: input.country,
    skuId: input.skuId,
    status: 'submitted',
    externalRef: `EXT-${id.toUpperCase()}`,
    createdAt: now,
    updatedAt: now,
  };
  requests.set(id, request);
  return request;
}

export function getPartnerRequest(id: string): PartnerRequest | undefined {
  return requests.get(id);
}

export function updatePartnerRequestStatus(
  id: string,
  status: PartnerRequestStatus,
): PartnerRequest | undefined {
  const req = requests.get(id);
  if (!req) return undefined;
  req.status = status;
  req.updatedAt = new Date().toISOString();
  return req;
}

export function listPartnerRequests(): PartnerRequest[] {
  return [...requests.values()];
}

export function recordWebhookEvent(event: Omit<PartnerWebhookEvent, 'id'>): PartnerWebhookEvent {
  const record: PartnerWebhookEvent = {
    id: `wh-${String(webhookEvents.length + 1).padStart(4, '0')}`,
    ...event,
  };
  webhookEvents.push(record);
  return record;
}

export function listWebhookEvents(): PartnerWebhookEvent[] {
  return [...webhookEvents];
}

/** Reset store — utile nei test */
export function resetPartnerStore(): void {
  requests.clear();
  webhookEvents.length = 0;
  idCounter = 1;
}
