/**
 * Modulo API NestJS `partner-webhook.service` — backend compliance Varco.
 */
import { Inject, Injectable } from '@nestjs/common';
import { type Database, partnerWebhookEvents } from '@varco/database';
import { DATABASE } from '../database/database.module';

/** Esportazione `PartnerWebhookPayload` — vedi implementazione sotto. */
export type PartnerWebhookPayload = {
  event?: string;
  partner_request_id?: string;
  external_ref?: string;
  type?: string;
  country?: string;
  status?: string;
  sku_id?: string | null;
  occurred_at?: string;
  [key: string]: unknown;
};

@Injectable()
/** Esportazione `PartnerWebhookService` — vedi implementazione sotto. */
export class PartnerWebhookService {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Registra evento webhook partner (audit trail) */
  async ingest(payload: PartnerWebhookPayload) {
    const [event] = await this.db
      .insert(partnerWebhookEvents)
      .values({
        payload,
        partnerRequestId: null,
      })
      .returning();

    return event;
  }
}
