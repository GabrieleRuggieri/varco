import assert from 'node:assert/strict';
import { test } from 'node:test';
import { loadMatrixBundle } from './load.js';

test('matrix-v0.yaml è valida e tutte le regole sono in bozza', async () => {
  const bundle = await loadMatrixBundle();
  assert.equal(bundle.version, '2026-06-01-v0');
  assert.ok(bundle.rules.length >= 10);
  assert.ok(bundle.rules.every((r) => r.review_status === 'bozza'));
});

test('matrix-v0 copre 5 paesi e 5 categorie', async () => {
  const bundle = await loadMatrixBundle();
  const countries = new Set(bundle.rules.flatMap((r) => r.countries));
  const categories = new Set(bundle.rules.flatMap((r) => r.product_categories));
  assert.equal(countries.size, 5);
  assert.equal(categories.size, 5);
});
