import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { DOCUMENT_TEMPLATE_IDS, type DocumentTemplateId } from '@varco/shared';

export class GenerateDocumentDto {
  @ApiProperty({ enum: DOCUMENT_TEMPLATE_IDS })
  @IsIn(DOCUMENT_TEMPLATE_IDS)
  templateId!: DocumentTemplateId;
}
