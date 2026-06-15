import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, WebhookAuth } from '../auth/decorators.js';
import {
  PartnerWebhookService,
  type PartnerWebhookPayload,
} from './partner-webhook.service';

@ApiTags('partner')
@Controller('internal/partner-webhook')
export class PartnerWebhookController {
  constructor(private readonly partnerWebhookService: PartnerWebhookService) {}

  @Public()
  @WebhookAuth()
  @Post()
  @ApiOperation({ summary: 'Webhook partner RP/EPR (mock o live)' })
  @ApiBody({ description: 'Payload evento partner' })
  async handleWebhook(
    @Body() payload: PartnerWebhookPayload,
    @Headers('x-varco-mock-partner') mockHeader?: string,
  ) {
    const event = await this.partnerWebhookService.ingest({
      ...payload,
      _source: mockHeader === 'true' ? 'mock-server' : 'external',
    });
    return { received: true, event_id: event?.id };
  }
}
