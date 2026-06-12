import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SkuClassifyDto {
  @ApiProperty({ description: 'UUID organizzazione tenant' })
  @IsUUID()
  organizationId!: string;
}
