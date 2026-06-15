import { describe, it, expect } from 'vitest';

function sanitizeCallbackUrl(raw: string | null): string {
  if (!raw) return '/';
  return raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';
}

describe('callbackUrl sanitization (stessa logica di LoginForm)', () => {
  it('accetta path relativi validi', () => {
    expect(sanitizeCallbackUrl('/dashboard')).toBe('/dashboard');
    expect(sanitizeCallbackUrl('/skus')).toBe('/skus');
    expect(sanitizeCallbackUrl('/')).toBe('/');
  });

  it('blocca open redirect con URL assoluto http', () => {
    expect(sanitizeCallbackUrl('https://evil.com')).toBe('/');
    expect(sanitizeCallbackUrl('http://evil.com/steal')).toBe('/');
  });

  it('blocca open redirect con protocol-relative URL', () => {
    expect(sanitizeCallbackUrl('//evil.com')).toBe('/');
  });

  it('fallback a / se null', () => {
    expect(sanitizeCallbackUrl(null)).toBe('/');
  });

  it('fallback a / se stringa vuota', () => {
    expect(sanitizeCallbackUrl('')).toBe('/');
  });
});
