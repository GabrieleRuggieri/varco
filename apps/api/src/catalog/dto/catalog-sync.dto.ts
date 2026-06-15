import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CatalogSyncDto {
  @ApiPropertyOptional({ description: 'UUID connessione catalogo (opzionale)' })
  @IsOptional()
  @IsUUID()
  connectionId?: string;
}
