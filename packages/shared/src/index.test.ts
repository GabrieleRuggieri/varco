import assert from 'node:assert/strict';
import { test } from 'node:test';
import { MVP_COUNTRIES, MVP_PRODUCT_CATEGORIES } from './index.js';

test('MVP copre 5 paesi', () => {
  assert.equal(MVP_COUNTRIES.length, 5);
});

test('MVP copre 5 categorie prodotto', () => {
  assert.equal(MVP_PRODUCT_CATEGORIES.length, 5);
});
