import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getTableName } from 'drizzle-orm';
import {
  CHECKLIST_STATUSES,
  MVP_COUNTRIES,
  MVP_PRODUCT_CATEGORIES,
  OBLIGATION_TYPES,
} from '@varco/shared';
import { organizations, skus, checklistItems } from './schema/index.js';

test('schema esporta tabelle core MVP', () => {
  assert.equal(getTableName(organizations), 'organizations');
  assert.equal(getTableName(skus), 'skus');
  assert.equal(getTableName(checklistItems), 'checklist_items');
});

test('enum DB allineati a @varco/shared', () => {
  // Verifica coerenza tra layer shared e schema PostgreSQL
  assert.deepEqual([...MVP_COUNTRIES], ['DE', 'FR', 'IT', 'ES', 'NL']);
  assert.equal(MVP_PRODUCT_CATEGORIES.length, 5);
  assert.equal(OBLIGATION_TYPES.length, 6);
  assert.equal(CHECKLIST_STATUSES.length, 6);
});
