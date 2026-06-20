/**
 * Controller checklist — obblighi per paese con filtro SKU opzionale validato.
 */
import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, type RequestUser } from '../auth/current-user.decorator';
import { ChecklistService } from './checklist.service';
import { ChecklistQueryDto } from './dto/checklist-query.dto';

@ApiTags('checklist')
@Controller('checklist')
/** Esportazione `ChecklistController` — vedi implementazione sotto. */
export class ChecklistController {
  constructor(private readonly checklistService: ChecklistService) {}

  @Get()
  @ApiOperation({ summary: 'Checklist obblighi per organizzazione (opz. filtro SKU)' })
  @ApiOkResponse({ description: 'Voci checklist con regola e gravità' })
  async list(@CurrentUser() user: RequestUser, @Query() query: ChecklistQueryDto) {
    const items = await this.checklistService.list(user.organizationId, query.skuId);
    return { items, total: items.length };
  }
}
