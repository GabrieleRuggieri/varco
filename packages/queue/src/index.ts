/**
 * Package condiviso `index` — logica riusabile nel monorepo Varco.
 */
export { getRedisUrl, getBullMqConnection } from './connection.js';
export {
  getVarcoQueue,
  closeVarcoQueue,
  enqueueCatalogSync,
  enqueueSkuClassify,
  enqueueDocumentGenerate,
  type EnqueuedJob,
} from './varco-queue.js';
