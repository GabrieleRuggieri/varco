import assert from 'node:assert/strict';
import { test } from 'node:test';
import { matchRules } from './engine.js';
import type { ObligationRuleInput } from './schema.js';

const sampleRules: ObligationRuleInput[] = [
  {
    id: 'gpsr_rp',
    countries: ['DE', 'FR'],
    product_categories: ['toys'],
    obligation_type: 'responsible_person',
    severity: 'critical',
    regulation_ref: 'GPSR',
    deadline_type: 'before_market_placement',
    document_templates: [],
    effective_from: '2024-12-13',
    review_status: 'bozza',
  },
  {
    id: 'epr_de',
    countries: ['DE'],
    product_categories: ['toys', 'apparel'],
    obligation_type: 'epr_packaging',
    severity: 'critical',
    regulation_ref: 'VerpackG',
    deadline_type: 'before_first_sale',
    document_templates: [],
    effective_from: '2019-01-01',
    review_status: 'approvata',
  },
];

test('matchRules filtra per categoria e paese', () => {
  const matched = matchRules(
    sampleRules,
    { product_category: 'toys', target_countries: ['DE'] },
    { environment: 'development' },
  );
  assert.equal(matched.length, 2);
});

test('matchRules in production esclude regole bozza', () => {
  const matched = matchRules(
    sampleRules,
    { product_category: 'toys', target_countries: ['DE'] },
    { environment: 'production' },
  );
  assert.equal(matched.length, 1);
  assert.equal(matched[0]?.id, 'epr_de');
});

test('matchRules non matcha categoria errata', () => {
  const matched = matchRules(sampleRules, {
    product_category: 'home',
    target_countries: ['DE'],
  });
  assert.equal(matched.length, 0);
});
