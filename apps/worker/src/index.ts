/**
 * Entrypoint worker BullMQ — consuma coda `varco` con logging strutturato.
 */
import { Worker } from 'bullmq';
import { getBullMqConnection } from '@varco/queue';
import { logger, MVP_VERSION, WORKER_QUEUE_NAME } from '@varco/shared';
import { processVarcoJob } from './processor.js';

const worker = new Worker(WORKER_QUEUE_NAME, processVarcoJob, {
  connection: getBullMqConnection(),
  concurrency: 4,
});

worker.on('completed', (job, result) => {
  logger.info({
    event: 'worker.job.completed',
    jobName: job.name,
    jobId: job.id,
    organizationId: (job.data as { organizationId?: string }).organizationId,
    result,
  });
});

worker.on('failed', (job, error) => {
  logger.error({
    event: 'worker.job.failed',
    jobName: job?.name,
    jobId: job?.id,
    error: error.message,
  });
});

worker.on('error', (error) => {
  logger.error({ event: 'worker.queue.error', error: error.message });
});

logger.info({ event: 'worker.started', mvpVersion: MVP_VERSION, queue: WORKER_QUEUE_NAME });

async function shutdown() {
  logger.info({ event: 'worker.shutdown' });
  await worker.close();
  process.exit(0);
}

process.on('SIGINT', () => void shutdown());
process.on('SIGTERM', () => void shutdown());
