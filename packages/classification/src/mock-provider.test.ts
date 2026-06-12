import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test, before } from 'node:test';
import { classifyWithMock, resetMockClassificationCache } from './mock-provider.js';

before(() => {
  resetMockClassificationCache();
  const pkgDir = path.dirname(fileURLToPath(import.meta.url));
  process.env.FIXTURES_DIR = path.resolve(pkgDir, '../../../fixtures');
});

test('classifyWithMock carica fixture per SKU noto', async () => {
  const result = await classifyWithMock({
    skuCode: 'TOYS-WOOD-050',
    productTitle: 'Blocchi costruzione legno',
    categoryHint: 'toys',
    materials: ['wood'],
  });
  assert.equal(result.product_category, 'toys');
  assert.ok(result.confidence >= 0.5);
});

test('classifyWithMock usa fallback se fixture assente', async () => {
  const result = await classifyWithMock({
    skuCode: 'SKU-INEXISTENT',
    productTitle: 'Prodotto test',
    categoryHint: 'apparel',
    materials: ['cotton'],
  });
  assert.equal(result.product_category, 'apparel');
  assert.equal(result.confidence, 0.82);
});
