import { Queue } from 'bullmq';
import { WORKER_QUEUE_NAME } from '@varco/shared';
import { getBullMqConnection } from '../config.js';

let queue: Queue | null = null;

/** Coda condivisa per enqueue da script o API (fase successiva). */
export function getVarcoQueue(): Queue {
  if (!queue) {
    queue = new Queue(WORKER_QUEUE_NAME, { connection: getBullMqConnection() });
  }
  return queue;
}
