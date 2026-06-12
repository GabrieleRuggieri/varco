import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderRiskAssessmentPdf } from './risk-assessment-toys.js';

test('renderRiskAssessmentPdf produce buffer PDF valido', async () => {
  const buffer = await renderRiskAssessmentPdf({
    organizationName: 'Varco Demo',
    skuCode: 'TOYS-WOOD-050',
    productTitle: 'Blocchi costruzione legno',
    productDescription: 'Giocattolo educativo età 3+',
    materials: ['wood', 'water_based_paint'],
    targetCountries: ['DE', 'FR', 'IT'],
    productCategory: 'toys',
    classificationConfidence: 0.91,
    generatedAt: '2026-06-12T12:00:00.000Z',
    templateId: 'risk_assessment',
    templateVersion: '1.0.0',
  });

  assert.ok(buffer.length > 500);
  assert.equal(buffer.subarray(0, 4).toString(), '%PDF');
});
