import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CatalogService } from './catalog.service';
import { CatalogSyncDto } from './dto/catalog-sync.dto';

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('connections')
  @ApiOperation({ summary: 'Connessioni marketplace per organizzazione' })
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiOkResponse({ description: 'Elenco connessioni catalogo' })
  async listConnections(@Query('organizationId') organizationId: string) {
    const connections = await this.catalogService.listConnections(organizationId);
    return { connections };
  }

  @Post('sync')
  @ApiOperation({ summary: 'Accoda sincronizzazione catalogo (job catalog.sync)' })
  @ApiOkResponse({ description: 'Job accodato su Redis/BullMQ' })
  async sync(@Body() body: CatalogSyncDto) {
    return this.catalogService.triggerSync(body.organizationId, body.connectionId);
  }
}
