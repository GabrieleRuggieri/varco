/**
 * DTO query checklist — validazione UUID opzionale skuId.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

/** Esportazione `ChecklistQueryDto` — vedi implementazione sotto. */
export class ChecklistQueryDto {
  @ApiPropertyOptional({ description: 'Filtra per UUID SKU' })
  @IsOptional()
  @IsUUID()
  skuId?: string;
}
