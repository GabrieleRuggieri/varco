import { describe, it, expect } from 'vitest';
import { ApiError } from '@/lib/api';

describe('ApiError', () => {
  it('è un Error con nome ApiError', () => {
    const err = new ApiError('Not found', 404);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ApiError');
  });

  it('espone status e message correttamente', () => {
    const err = new ApiError('Forbidden', 403);
    expect(err.message).toBe('Forbidden');
    expect(err.status).toBe(403);
  });

  it('viene catturato come Error generico', () => {
    const err = new ApiError('Server error', 500);
    expect(err instanceof Error).toBe(true);
  });
});
