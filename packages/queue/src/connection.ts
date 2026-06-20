/**
 * Package condiviso `connection` — logica riusabile nel monorepo Varco.
 */
import type { ConnectionOptions } from 'bullmq';

/** Esportazione `getRedisUrl` — vedi implementazione sotto. */
export function getRedisUrl(): string {
  return process.env.REDIS_URL ?? 'redis://localhost:6379';
}

/** Opzioni Redis per BullMQ — istanza gestita internamente da BullMQ. */
export function getBullMqConnection(): ConnectionOptions {
  const url = new URL(getRedisUrl());
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    maxRetriesPerRequest: null,
  };
}
