/**
 * Modulo API NestJS `partner.module` — backend compliance Varco.
 */
import { Module } from '@nestjs/common';
import { PartnerWebhookController } from './partner-webhook.controller';
import { PartnerWebhookService } from './partner-webhook.service';

@Module({
  controllers: [PartnerWebhookController],
  providers: [PartnerWebhookService],
})
/** Esportazione `PartnerModule` — vedi implementazione sotto. */
export class PartnerModule {}
