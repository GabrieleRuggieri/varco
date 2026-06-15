import assert from 'node:assert/strict';
import test from 'node:test';
import { signApiAccessToken, verifyApiAccessToken } from './jwt.js';

test('sign e verify API access token', async () => {
  process.env.AUTH_SECRET = 'test-secret-minimum-32-characters-long';

  const token = await signApiAccessToken({
    sub: 'user-1',
    email: 'admin@varco.local',
    organizationId: 'org-1',
    organizationIds: ['org-1'],
    organizationName: 'Varco Demo',
  });

  const payload = await verifyApiAccessToken(token);
  assert.equal(payload.sub, 'user-1');
  assert.equal(payload.organizationId, 'org-1');
});
