/**
 * Sorgente TypeScript `auth` — progetto Varco.
 */
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const nextAuth = NextAuth(authConfig);

/** Esportazione `handlers` — vedi implementazione sotto. */
export const handlers = nextAuth.handlers;
/** Esportazione `auth` — vedi implementazione sotto. */
export const auth = nextAuth.auth;
/** Esportazione `signIn` — vedi implementazione sotto. */
export const signIn = nextAuth.signIn;
/** Esportazione `signOut` — vedi implementazione sotto. */
export const signOut = nextAuth.signOut;

export type { VarcoSessionUser } from './auth.config';
