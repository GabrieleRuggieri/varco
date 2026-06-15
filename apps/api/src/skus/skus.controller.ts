import { Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { type SkusService } from './skus.service';

@ApiTags('skus')
@Controller('skus')
export class SkusController {
  constructor(private readonly skusService: SkusService) {}

  @Get()
  @ApiOperation({ summary: 'Lista SKU per organizzazione' })
  @ApiOkResponse({ description: 'SKU normalizzati dal catalogo' })
  async list(@CurrentUser() user: RequestUser) {
    const items = await this.skusService.listByOrganization(user.organizationId);
    return { skus: items, total: items.length };
  }

  @Post(':id/classify')
  @ApiOperation({ summary: 'Accoda classificazione SKU (job sku.classify)' })
  @ApiParam({ name: 'id', description: 'UUID SKU' })
  @ApiOkResponse({ description: 'Job classificazione accodato' })
  async classify(@Param('id') skuId: string, @CurrentUser() user: RequestUser) {
    return this.skusService.triggerClassify(user.organizationId, skuId);
  }

  @Get(':id/classification')
  @ApiOperation({ summary: 'Ultima classificazione SKU' })
  @ApiParam({ name: 'id', description: 'UUID SKU' })
  @ApiOkResponse({ description: 'Classification run più recente' })
  async getClassification(@Param('id') skuId: string, @CurrentUser() user: RequestUser) {
    const classification = await this.skusService.getLatestClassification(
      user.organizationId,
      skuId,
    );
    return { classification };
  }
}
