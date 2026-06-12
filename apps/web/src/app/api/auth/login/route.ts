import { NextResponse } from 'next/server';
import { api } from '@/lib/api';
import { DEMO_EMAIL, DEMO_PASSWORD } from '@/lib/config';
import { setSession } from '@/lib/session';

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };

  if (body.email !== DEMO_EMAIL || body.password !== DEMO_PASSWORD) {
    return NextResponse.json({ error: 'Credenziali non valide' }, { status: 401 });
  }

  const { organizations } = await api.getOrganizations();
  const org = organizations.find((o) => o.name === 'Varco Demo') ?? organizations[0];

  if (!org) {
    return NextResponse.json(
      { error: 'Organizzazione demo non trovata — esegui pnpm db:seed' },
      { status: 503 },
    );
  }

  await setSession({
    email: DEMO_EMAIL,
    organizationId: org.id,
    organizationName: org.name,
  });

  return NextResponse.json({ ok: true, organizationId: org.id });
}
