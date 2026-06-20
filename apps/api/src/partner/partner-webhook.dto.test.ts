/**
 * Test validazione DTO webhook partner — campi obbligatori e formati.
 */
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { PartnerWebhookDto } from './partner-webhook.dto.js';

test('PartnerWebhookDto: payload valido passa validazione', async () => {
  const dto = plainToInstance(PartnerWebhookDto, {
    event: 'status_update',
    external_ref: 'partner-ref-001',
    type: 'rp_nomination',
    country: 'DE',
    status: 'completed',
    occurred_at: '2026-06-20T12:00:00.000Z',
    sku_id: '550e8400-e29b-41d4-a716-446655440000',
  });
  const errors = await validate(dto);
  assert.equal(errors.length, 0);
});

test('PartnerWebhookDto: payload vuoto fallisce', async () => {
  const dto = plainToInstance(PartnerWebhookDto, {});
  const errors = await validate(dto);
  assert.ok(errors.length > 0);
});

test('PartnerWebhookDto: UUID sku_id invalido fallisce', async () => {
  const dto = plainToInstance(PartnerWebhookDto, {
    event: 'status_update',
    external_ref: 'ref',
    type: 'rp',
    country: 'DE',
    status: 'pending',
    occurred_at: '2026-06-20T12:00:00.000Z',
    sku_id: 'not-a-uuid',
  });
  const errors = await validate(dto);
  assert.ok(errors.some((e) => e.property === 'sku_id'));
});
