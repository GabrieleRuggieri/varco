import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MVP_VERSION } from '@varco/shared';
import { Public } from '../auth/decorators.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
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
