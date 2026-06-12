export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
}

export const DEMO_EMAIL = 'demo@varco.local';
export const DEMO_PASSWORD = 'demo';
