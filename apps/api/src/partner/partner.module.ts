import { Module } from '@nestjs/common';
import { PartnerWebhookController } from './partner-webhook.controller';
import { PartnerWebhookService } from './partner-webhook.service';

@Module({
  controllers: [PartnerWebhookController],
  providers: [PartnerWebhookService],
})
export class PartnerModule {}
