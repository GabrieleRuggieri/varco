import { Queue, type Job, type JobsOptions } from 'bullmq';

export type EnqueuedJob = Pick<Job, 'id' | 'name'>;
import {
  WORKER_QUEUE_NAME,
  WORKER_JOB_NAMES,
  type CatalogSyncJobPayload,
  type DocumentGenerateJobPayload,
  type SkuClassifyJobPayload,
} from '@varco/shared';
import { getBullMqConnection } from './connection.js';

const DEFAULT_JOB_OPTIONS: JobsOptions = {
  removeOnComplete: { count: 200 },
  removeOnFail: { count: 500 },
  attempts: 3,
  backoff: { type: 'exponential', delay: 2000 },
};

let queue: Queue | null = null;

export function getVarcoQueue(): Queue {
  if (!queue) {
    queue = new Queue(WORKER_QUEUE_NAME, { connection: getBullMqConnection() });
  }
  return queue;
}

/** Chiude la coda — utile in script one-shot e shutdown graceful. */
export async function closeVarcoQueue(): Promise<void> {
  if (queue) {
    await queue.close();
    queue = null;
  }
}

async function addJob(name: string, data: unknown, jobId: string): Promise<EnqueuedJob> {
  const q = getVarcoQueue();
  const job = await q.add(name, data, {
    ...DEFAULT_JOB_OPTIONS,
    jobId,
  });
  return { id: job.id, name: job.name };
}

export async function enqueueCatalogSync(
  payload: CatalogSyncJobPayload,
  options?: { force?: boolean },
): Promise<EnqueuedJob> {
  const suffix = options?.force ? `-${Date.now()}` : '';
  return addJob(
    WORKER_JOB_NAMES.CATALOG_SYNC,
    payload,
    `catalog-sync-${payload.organizationId}${suffix}`,
  );
}

export async function enqueueSkuClassify(payload: SkuClassifyJobPayload): Promise<EnqueuedJob> {
  return addJob(WORKER_JOB_NAMES.SKU_CLASSIFY, payload, `sku-classify-${payload.skuId}`);
}

export async function enqueueDocumentGenerate(
  payload: DocumentGenerateJobPayload,
): Promise<EnqueuedJob> {
  return addJob(
    WORKER_JOB_NAMES.DOCUMENT_GENERATE,
    payload,
    `document-${payload.skuId}-${payload.templateId}`,
  );
}
