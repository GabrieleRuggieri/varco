/**
 * Modulo API NestJS `checklist.module` — backend compliance Varco.
 */
import { Module } from '@nestjs/common';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';

@Module({
  controllers: [ChecklistController],
  providers: [ChecklistService],
})
/** Esportazione `ChecklistModule` — vedi implementazione sotto. */
export class ChecklistModule {}
