/**
 * Modulo API NestJS `skus.module` — backend compliance Varco.
 */
import { Module } from '@nestjs/common';
import { SkusController } from './skus.controller';
import { SkusService } from './skus.service';

@Module({
  controllers: [SkusController],
  providers: [SkusService],
})
/** Esportazione `SkusModule` — vedi implementazione sotto. */
export class SkusModule {}
