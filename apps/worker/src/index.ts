import { Worker } from 'bullmq';
import { getBullMqConnection } from '@varco/queue';
import { MVP_VERSION, WORKER_QUEUE_NAME } from '@varco/shared';
import { processVarcoJob } from './processor.js';

const worker = new Worker(WORKER_QUEUE_NAME, processVarcoJob, {
  connection: getBullMqConnection(),
  concurrency: 4,
});

worker.on('completed', (job, result) => {
  console.log(`[worker] ${job.name} #${job.id} completato`, result);
});

worker.on('failed', (job, error) => {
  console.error(`[worker] ${job?.name ?? 'unknown'} fallito:`, error.message);
});

worker.on('error', (error) => {
  console.error('[worker] errore coda:', error.message);
});

console.log(`[worker] avviato — MVP ${MVP_VERSION}, coda "${WORKER_QUEUE_NAME}"`);

async function shutdown() {
  console.log('[worker] arresto in corso...');
  await worker.close();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
