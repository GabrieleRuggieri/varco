import type { Job } from 'bullmq';
import {
  WORKER_JOB_NAMES,
  type CatalogSyncJobPayload,
  type DocumentGenerateJobPayload,
  type SkuClassifyJobPayload,
} from '@varco/shared';
import { getDb } from './db.js';
import { handleCatalogSync } from './jobs/catalog-sync.handler.js';
import { handleDocumentGenerate } from './jobs/document-generate.handler.js';
import { handleSkuClassify } from './jobs/sku-classify.handler.js';

export async function processVarcoJob(job: Job): Promise<unknown> {
  const db = getDb();

  switch (job.name) {
    case WORKER_JOB_NAMES.CATALOG_SYNC:
      return handleCatalogSync(db, job.data as CatalogSyncJobPayload);
    case WORKER_JOB_NAMES.SKU_CLASSIFY:
      return handleSkuClassify(db, job.data as SkuClassifyJobPayload);
    case WORKER_JOB_NAMES.DOCUMENT_GENERATE:
      return handleDocumentGenerate(db, job.data as DocumentGenerateJobPayload);
    default:
      throw new Error(`Job sconosciuto: ${job.name}`);
  }
}
