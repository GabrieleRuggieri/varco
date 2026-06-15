/** URL base API NestJS (server-side e BFF — non esporre al client). */
export function getApiBaseUrl(): string {
  return process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';
}
