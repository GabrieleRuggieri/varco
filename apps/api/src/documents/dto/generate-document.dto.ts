/**
 * Modulo API NestJS `generate-document.dto` — backend compliance Varco.
 */
import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { DOCUMENT_TEMPLATE_IDS, type DocumentTemplateId } from '@varco/shared';

/** Esportazione `GenerateDocumentDto` — vedi implementazione sotto. */
export class GenerateDocumentDto {
  @ApiProperty({ enum: DOCUMENT_TEMPLATE_IDS })
  @IsIn(DOCUMENT_TEMPLATE_IDS)
  templateId!: DocumentTemplateId;
}
