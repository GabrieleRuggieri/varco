/**
 * Modulo API NestJS `catalog-sync.dto` — backend compliance Varco.
 */
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

/** Esportazione `CatalogSyncDto` — vedi implementazione sotto. */
export class CatalogSyncDto {
  @ApiPropertyOptional({ description: 'UUID connessione catalogo (opzionale)' })
  @IsOptional()
  @IsUUID()
  connectionId?: string;
}
