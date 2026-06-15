import { Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public, WebhookAuth } from '../auth/decorators.js';
import { PartnerWebhookService } from './partner-webhook.service.js';
import { PartnerWebhookDto } from './partner-webhook.dto.js';

@ApiTags('partner')
@Controller('internal/partner-webhook')
export class PartnerWebhookController {
  constructor(private readonly partnerWebhookService: PartnerWebhookService) {}

  @Public()
  @WebhookAuth()
  @Post()
  @ApiOperation({ summary: 'Webhook partner RP/EPR (mock o live)' })
  @ApiBody({ type: PartnerWebhookDto, description: 'Payload evento partner' })
  async handleWebhook(
    @Body() payload: PartnerWebhookDto,
    @Headers('x-varco-mock-partner') mockHeader?: string,
  ) {
    const event = await this.partnerWebhookService.ingest({
      ...payload,
      _source: mockHeader === 'true' ? 'mock-server' : 'external',
    });
    return { received: true, event_id: event?.id };
  }
}
