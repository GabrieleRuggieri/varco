/**
 * Modulo API NestJS `queue.service` — backend compliance Varco.
 */
import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import {
  closeVarcoQueue,
  enqueueCatalogSync,
  enqueueDocumentGenerate,
  enqueueSkuClassify,
} from '@varco/queue';
import type { EnqueuedJob } from '@varco/queue';
import type {
  CatalogSyncJobPayload,
  DocumentGenerateJobPayload,
  SkuClassifyJobPayload,
} from '@varco/shared';

@Injectable()
/** Esportazione `QueueService` — vedi implementazione sotto. */
export class QueueService implements OnModuleDestroy {
  enqueueCatalogSync(payload: CatalogSyncJobPayload): Promise<EnqueuedJob> {
    return enqueueCatalogSync(payload);
  }

  enqueueSkuClassify(payload: SkuClassifyJobPayload): Promise<EnqueuedJob> {
    return enqueueSkuClassify(payload);
  }

  enqueueDocumentGenerate(payload: DocumentGenerateJobPayload): Promise<EnqueuedJob> {
    return enqueueDocumentGenerate(payload);
  }

  async onModuleDestroy() {
    await closeVarcoQueue();
  }
}
