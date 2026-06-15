import { SignJWT, jwtVerify } from 'jose';
import {
  API_JWT_AUDIENCE,
  API_JWT_EXPIRY,
  API_JWT_ISSUER,
  type ApiAccessTokenPayload,
} from './types.js';

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'AUTH_SECRET non configurato o troppo corto (min 32 caratteri). ' +
        'Imposta la variabile di ambiente in tutti gli ambienti.',
    );
  }
  return secret;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(getAuthSecret());
}

export async function signApiAccessToken(payload: ApiAccessTokenPayload): Promise<string> {
  return new SignJWT({
    email: payload.email,
    organizationId: payload.organizationId,
    organizationIds: payload.organizationIds,
    organizationName: payload.organizationName,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setIssuer(process.env.API_JWT_ISSUER ?? API_JWT_ISSUER)
    .setAudience(API_JWT_AUDIENCE)
    .setExpirationTime(API_JWT_EXPIRY)
    .sign(secretKey());
}

export async function verifyApiAccessToken(token: string): Promise<ApiAccessTokenPayload> {
  const { payload } = await jwtVerify(token, secretKey(), {
    issuer: process.env.API_JWT_ISSUER ?? API_JWT_ISSUER,
    audience: API_JWT_AUDIENCE,
  });

  const sub = payload.sub;
  const email = payload.email;
  const organizationId = payload.organizationId;
  const organizationIds = payload.organizationIds;
  const organizationName = payload.organizationName;

  if (
    typeof sub !== 'string' ||
    typeof email !== 'string' ||
    typeof organizationId !== 'string' ||
    !Array.isArray(organizationIds) ||
    organizationIds.some((id) => typeof id !== 'string') ||
    typeof organizationName !== 'string'
  ) {
    throw new Error('Token JWT non valido: payload incompleto');
  }

  if (!organizationIds.includes(organizationId)) {
    throw new Error('Token JWT non valido: organizzazione non autorizzata');
  }

  return {
    sub,
    email,
    organizationId,
    organizationIds,
    organizationName,
  };
}
