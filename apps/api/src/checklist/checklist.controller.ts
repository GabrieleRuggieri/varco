import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { ChecklistService } from './checklist.service';

@ApiTags('checklist')
@Controller('checklist')
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  @ApiOperation({ summary: 'Checklist obblighi per organizzazione (opz. filtro SKU)' })
  @ApiQuery({ name: 'skuId', required: false })
  @ApiOkResponse({ description: 'Voci checklist con regola e gravità' })
  async list(@CurrentUser() user: RequestUser, @Query('skuId') skuId?: string) {
    const items = await this.checklistService.list(user.organizationId, skuId);
    return { items, total: items.length };
  }
}
