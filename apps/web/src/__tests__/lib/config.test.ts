import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('getApiBaseUrl', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('usa API_URL se impostato', async () => {
    process.env.API_URL = 'http://api.example.com/api';
    const { getApiBaseUrl } = await import('@/lib/config');
    expect(getApiBaseUrl()).toBe('http://api.example.com/api');
  });

  it('fallback a NEXT_PUBLIC_API_URL per retrocompatibilità', async () => {
    delete process.env.API_URL;
    process.env.NEXT_PUBLIC_API_URL = 'http://legacy.example.com/api';
    const { getApiBaseUrl } = await import('@/lib/config');
    expect(getApiBaseUrl()).toBe('http://legacy.example.com/api');
  });

  it('fallback a localhost se nessuna variabile impostata', async () => {
    delete process.env.API_URL;
    delete process.env.NEXT_PUBLIC_API_URL;
    const { getApiBaseUrl } = await import('@/lib/config');
    expect(getApiBaseUrl()).toBe('http://localhost:3001/api');
  });
});
