export function getRedisUrl(): string {
  return process.env.REDIS_URL ?? 'redis://localhost:6379';
}

/** Opzioni Redis per BullMQ (evita conflitti di versione ioredis). */
export function getBullMqConnection() {
  const url = new URL(getRedisUrl());
  return {
    host: url.hostname,
    port: Number(url.port || 6379),
    username: url.username || undefined,
    password: url.password || undefined,
    maxRetriesPerRequest: null as null,
  };
}

export function getMockServerUrl(): string {
  return process.env.MOCK_SERVER_URL ?? 'http://localhost:4010';
}
