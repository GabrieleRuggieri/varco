/** Payload JWT per accesso API — emesso dalla web app dopo login Auth.js */
export type ApiAccessTokenPayload = {
  sub: string;
  email: string;
  organizationId: string;
  organizationIds: string[];
  organizationName: string;
};

/** Esportazione `API_JWT_AUDIENCE` — vedi implementazione sotto. */
export const API_JWT_AUDIENCE = 'varco-api';
/** Esportazione `API_JWT_ISSUER` — vedi implementazione sotto. */
export const API_JWT_ISSUER = 'varco-web';
/** Esportazione `API_JWT_EXPIRY` — vedi implementazione sotto. */
export const API_JWT_EXPIRY = '15m';
