/**
 * Test unitari withOrgContext — verifica struttura transazione (mock).
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { withOrgContext, withUserContext } from './org-context.js';

test('withOrgContext invoca transaction e callback', async () => {
  const calls: string[] = [];
  const mockDb = {
    transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
      calls.push('transaction');
      const mockTx = {
        execute: async () => {
          calls.push('set_config');
        },
      };
      return fn(mockTx);
    },
  };

  const result = await withOrgContext(mockDb as never, 'org-123', async (_tx) => {
    calls.push('callback');
    return 42;
  });

  assert.equal(result, 42);
  assert.deepEqual(calls, ['transaction', 'set_config', 'callback']);
});

test('withUserContext invoca transaction', async () => {
  let txCalled = false;
  const mockDb = {
    transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
      const mockTx = { execute: async () => undefined };
      txCalled = true;
      return fn(mockTx);
    },
  };

  await withUserContext(mockDb as never, 'user-456', async () => 'ok');
  assert.equal(txCalled, true);
});
