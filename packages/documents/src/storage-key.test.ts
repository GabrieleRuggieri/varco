import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildDocumentStorageKey } from './storage-key.js';

test('buildDocumentStorageKey usa gerarchia tenant/sku/template', () => {
  const key = buildDocumentStorageKey({
    organizationId: 'org-1',
    skuId: 'sku-1',
    templateId: 'risk_assessment',
    version: '1.0.0-123',
  });
  assert.equal(key, 'org-1/sku-1/risk_assessment/1.0.0-123.pdf');
});
