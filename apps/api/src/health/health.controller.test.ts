import assert from 'node:assert/strict';
import { test } from 'node:test';
import { HealthController } from './health.controller';

test('health restituisce status ok', () => {
  const controller = new HealthController();
  const result = controller.getHealth();
  assert.equal(result.status, 'ok');
  assert.equal(result.framework, 'nestjs');
});
