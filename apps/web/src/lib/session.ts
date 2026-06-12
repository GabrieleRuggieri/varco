import { cookies } from 'next/headers';

export const SESSION_COOKIE = 'varco_session';

export type VarcoSession = {
  email: string;
  organizationId: string;
  organizationName: string;
};

export async function getSession(): Promise<VarcoSession | null> {
  const jar = await cookies();
  const raw = jar.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as VarcoSession;
  } catch {
    return null;
  }
}

export async function setSession(session: VarcoSession): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}
