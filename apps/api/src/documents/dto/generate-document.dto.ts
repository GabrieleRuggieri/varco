import { ApiProperty } from '@nestjs/swagger';
import { DOCUMENT_TEMPLATE_IDS } from '@varco/shared';
import { IsIn, IsUUID } from 'class-validator';

export class GenerateDocumentDto {
  @ApiProperty({ description: 'UUID organizzazione tenant' })
  @IsUUID()
  organizationId!: string;

  @ApiProperty({
    description: 'Template documento GPSR',
    enum: DOCUMENT_TEMPLATE_IDS,
    default: 'risk_assessment',
  })
  @IsIn([...DOCUMENT_TEMPLATE_IDS])
  templateId: (typeof DOCUMENT_TEMPLATE_IDS)[number] = 'risk_assessment';
}
