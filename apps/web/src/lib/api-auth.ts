import { signApiAccessToken } from '@varco/auth';
import { auth, type VarcoSessionUser } from '@/auth';

export type VarcoSession = VarcoSessionUser;

export async function getSession(): Promise<VarcoSession | null> {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user as VarcoSession;
}

export async function getApiAccessToken(): Promise<string> {
  const session = await getSession();
  if (!session) {
    throw new Error('Sessione non valida');
  }

  return signApiAccessToken({
    sub: session.id,
    email: session.email,
    organizationId: session.organizationId,
    organizationIds: session.organizationIds,
    organizationName: session.organizationName,
  });
}
