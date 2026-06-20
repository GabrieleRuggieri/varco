/**
 * Test unitari health controller — liveness e readiness con DB mock.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HealthController } from './health.controller.js';

const mockDb = {
  execute: async () => [{ '?column?': 1 }],
};

test('health/live restituisce status ok', () => {
  const controller = new HealthController(mockDb as never);
  const result = controller.getLive();
  assert.equal(result.status, 'ok');
  assert.equal(result.framework, 'nestjs');
});

test('health/ready restituisce ok se DB risponde', async () => {
  const controller = new HealthController(mockDb as never);
  const result = await controller.getReady();
  assert.equal(result.status, 'ok');
  assert.equal(result.database, 'connected');
});

test('health/ready fallisce se DB non risponde', async () => {
  const failingDb = {
    execute: async () => {
      throw new Error('connection refused');
    },
  };
  const controller = new HealthController(failingDb as never);
  await assert.rejects(() => controller.getReady(), /unavailable|Service Unavailable/i);
});
