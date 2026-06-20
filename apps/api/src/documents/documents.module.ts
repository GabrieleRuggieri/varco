/**
 * Modulo API NestJS `documents.module` — backend compliance Varco.
 */
import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
/** Esportazione `DocumentsModule` — vedi implementazione sotto. */
export class DocumentsModule {}
