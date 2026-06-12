import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mapDbObligationRule } from './db-mapper.js';

test('mapDbObligationRule converte campi snake DB in formato matrice', () => {
  const mapped = mapDbObligationRule({
    id: 'gpsr_rp_v0',
    matrixVersionId: '00000000-0000-0000-0000-000000000001',
    countries: ['DE', 'IT'],
    productCategories: ['toys'],
    obligationType: 'responsible_person',
    severity: 'critical',
    regulationRef: 'GPSR Art. 16',
    deadlineType: 'before_market_placement',
    checklistTemplateId: 'rp_appointment',
    effectiveFrom: new Date('2024-12-13'),
    reviewStatus: 'bozza',
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
    createdAt: new Date(),
  });

  assert.equal(mapped.id, 'gpsr_rp_v0');
  assert.deepEqual(mapped.product_categories, ['toys']);
  assert.equal(mapped.effective_from, '2024-12-13');
});
