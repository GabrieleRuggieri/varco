import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MVP_VERSION } from '@varco/shared';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check API' })
  @ApiOkResponse({ description: 'Servizio operativo' })
  getHealth() {
    return {
      status: 'ok',
      service: '@varco/api',
      mvpVersion: MVP_VERSION,
      framework: 'nestjs',
    };
  }
}
