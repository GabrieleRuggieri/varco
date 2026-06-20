/**
 * Modulo API NestJS `health.module` — backend compliance Varco.
 */
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';

@Module({
  controllers: [HealthController],
})
/** Esportazione `HealthModule` — vedi implementazione sotto. */
export class HealthModule {}
