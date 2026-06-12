import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SkuClassifyDto } from './dto/sku-classify.dto';
import { SkusService } from './skus.service';

@ApiTags('skus')
@Controller('skus')
export class SkusController {
  constructor(private readonly skusService: SkusService) {}

  @Get()
  @ApiOperation({ summary: 'Lista SKU per organizzazione' })
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiOkResponse({ description: 'SKU normalizzati dal catalogo' })
  async list(@Query('organizationId') organizationId: string) {
    const items = await this.skusService.listByOrganization(organizationId);
    return { skus: items, total: items.length };
  }

  @Post(':id/classify')
  @ApiOperation({ summary: 'Accoda classificazione SKU (job sku.classify)' })
  @ApiParam({ name: 'id', description: 'UUID SKU' })
  @ApiOkResponse({ description: 'Job classificazione accodato' })
  async classify(@Param('id') skuId: string, @Body() body: SkuClassifyDto) {
    return this.skusService.triggerClassify(body.organizationId, skuId);
  }

  @Get(':id/classification')
  @ApiOperation({ summary: 'Ultima classificazione SKU' })
  @ApiParam({ name: 'id', description: 'UUID SKU' })
  @ApiQuery({ name: 'organizationId', required: true })
  @ApiOkResponse({ description: 'Classification run più recente' })
  async getClassification(
    @Param('id') skuId: string,
    @Query('organizationId') organizationId: string,
  ) {
    const classification = await this.skusService.getLatestClassification(organizationId, skuId);
    return { classification };
  }
}
