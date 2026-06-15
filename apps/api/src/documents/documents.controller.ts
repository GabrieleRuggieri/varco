import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { DocumentsService } from './documents.service';
import { GenerateDocumentDto } from './dto/generate-document.dto';

@ApiTags('documents')
@Controller()
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get('skus/:skuId/documents')
  @ApiOperation({ summary: 'Documenti generati per SKU' })
  @ApiParam({ name: 'skuId', description: 'UUID SKU' })
  async listBySku(@Param('skuId') skuId: string, @CurrentUser() user: RequestUser) {
    const items = await this.documentsService.listBySku(user.organizationId, skuId);
    return { documents: items, total: items.length };
  }

  @Post('skus/:skuId/documents')
  @ApiOperation({ summary: 'Accoda generazione documento (job document.generate)' })
  @ApiParam({ name: 'skuId', description: 'UUID SKU' })
  @ApiOkResponse({ description: 'Job generazione PDF accodato' })
  async generate(
    @Param('skuId') skuId: string,
    @CurrentUser() user: RequestUser,
    @Body() body: GenerateDocumentDto,
  ) {
    return this.documentsService.triggerGenerate(
      user.organizationId,
      skuId,
      body.templateId,
    );
  }

  @Get('documents/:id/download')
  @ApiOperation({ summary: 'URL firmato per download PDF da object storage' })
  @ApiParam({ name: 'id', description: 'UUID documento' })
  async download(@Param('id') documentId: string, @CurrentUser() user: RequestUser) {
    return this.documentsService.getDownloadUrl(user.organizationId, documentId);
  }
}
