import assert from 'node:assert/strict';
import { test } from 'node:test';
import { parseShopifyTags } from './parse-shopify-tags.js';

test('parseShopifyTags estrae categoria, materiali e paesi', () => {
  const parsed = parseShopifyTags(
    'varco_category:toys, materials:wood,water_based_paint, target_countries:DE,FR,IT',
  );
  assert.equal(parsed.categoryHint, 'toys');
  assert.deepEqual(parsed.materials, ['wood', 'water_based_paint']);
  assert.deepEqual(parsed.targetCountries, ['DE', 'FR', 'IT']);
});

test('parseShopifyTags ignora valori fuori MVP', () => {
  const parsed = parseShopifyTags('varco_category:unknown, target_countries:US,DE');
  assert.equal(parsed.categoryHint, null);
  assert.deepEqual(parsed.targetCountries, ['DE']);
});
