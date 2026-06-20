/**
 * Modulo API NestJS `catalog.controller` — backend compliance Varco.
 */
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { CatalogService } from './catalog.service';
import { CatalogSyncDto } from './dto/catalog-sync.dto';

@ApiTags('catalog')
@Controller('catalog')
/** Esportazione `CatalogController` — vedi implementazione sotto. */
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('connections')
  @ApiOperation({ summary: 'Connessioni marketplace per organizzazione' })
  @ApiOkResponse({ description: 'Elenco connessioni catalogo' })
  async listConnections(@CurrentUser() user: RequestUser) {
    const connections = await this.catalogService.listConnections(user.organizationId);
    return { connections };
  }

  @Post('sync')
  @ApiOperation({ summary: 'Accoda sincronizzazione catalogo (job catalog.sync)' })
  @ApiOkResponse({ description: 'Job accodato su Redis/BullMQ' })
  async sync(@CurrentUser() user: RequestUser, @Body() body: CatalogSyncDto) {
    return this.catalogService.triggerSync(user.organizationId, body.connectionId);
  }
}
