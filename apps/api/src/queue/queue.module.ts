/**
 * Modulo API NestJS `queue.module` — backend compliance Varco.
 */
import { Global, Module } from '@nestjs/common';
import { QueueService } from './queue.service';

@Global()
@Module({
  providers: [QueueService],
  exports: [QueueService],
})
/** Esportazione `QueueModule` — vedi implementazione sotto. */
export class QueueModule {}
