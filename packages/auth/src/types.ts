/** Payload JWT per accesso API — emesso dalla web app dopo login Auth.js */
export type ApiAccessTokenPayload = {
  sub: string;
  email: string;
  organizationId: string;
  organizationIds: string[];
  organizationName: string;
};

export const API_JWT_AUDIENCE = 'varco-api';
export const API_JWT_ISSUER = 'varco-web';
export const API_JWT_EXPIRY = '15m';
