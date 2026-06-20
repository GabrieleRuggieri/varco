/**
 * Processor job BullMQ — smista su handler e imposta contesto RLS org.
 */
import type { Job } from 'bullmq';
import {
  WORKER_JOB_NAMES,
  type CatalogSyncJobPayload,
  type DocumentGenerateJobPayload,
  type SkuClassifyJobPayload,
} from '@varco/shared';
import { withOrgContext } from '@varco/database';
import { getDb } from './db.js';
import { handleCatalogSync } from './jobs/catalog-sync.handler.js';
import { handleDocumentGenerate } from './jobs/document-generate.handler.js';
import { handleSkuClassify } from './jobs/sku-classify.handler.js';

/** Esportazione `processVarcoJob` — vedi implementazione sotto. */
export async function processVarcoJob(job: Job): Promise<unknown> {
  const db = getDb();
  const data = job.data as { organizationId: string };

  switch (job.name) {
    case WORKER_JOB_NAMES.CATALOG_SYNC:
      return withOrgContext(db, data.organizationId, (tx) =>
        handleCatalogSync(tx, job.data as CatalogSyncJobPayload),
      );
    case WORKER_JOB_NAMES.SKU_CLASSIFY:
      return withOrgContext(db, data.organizationId, (tx) =>
        handleSkuClassify(tx, job.data as SkuClassifyJobPayload),
      );
    case WORKER_JOB_NAMES.DOCUMENT_GENERATE:
      return withOrgContext(db, data.organizationId, (tx) =>
        handleDocumentGenerate(tx, job.data as DocumentGenerateJobPayload),
      );
    default:
      throw new Error(`Job sconosciuto: ${job.name}`);
  }
}
