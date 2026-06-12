import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class CatalogSyncDto {
  @ApiProperty({ description: 'UUID organizzazione tenant' })
  @IsUUID()
  organizationId!: string;

  @ApiPropertyOptional({ description: 'UUID connessione catalogo (opzionale)' })
  @IsOptional()
  @IsUUID()
  connectionId?: string;
}
