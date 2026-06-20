/**
 * Pagina o route Next.js `route` — UI dashboard Varco.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { signApiAccessToken } from '@varco/auth';
import { auth } from '@/auth';
import { getApiBaseUrl } from '@/lib/config';

type RouteContext = { params: Promise<{ path?: string[] }> };

async function proxy(request: NextRequest, context: RouteContext) {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || !user.email || !user.organizationId || !user.organizationName) {
    return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
  }

  const { path = [] } = await context.params;
  const targetPath = path.join('/');
  const search = request.nextUrl.search;
  const token = await signApiAccessToken({
    sub: user.id,
    email: user.email,
    organizationId: user.organizationId,
    organizationIds: user.organizationIds ?? [user.organizationId],
    organizationName: user.organizationName,
  });

  const headers = new Headers();
  headers.set('Authorization', `Bearer ${token}`);
  const contentType = request.headers.get('content-type');
  if (contentType) {
    headers.set('Content-Type', contentType);
  }

  const body =
    request.method === 'GET' || request.method === 'HEAD' ? undefined : await request.text();

  let upstream: Response;
  try {
    upstream = await fetch(`${getApiBaseUrl()}/${targetPath}${search}`, {
      method: request.method,
      headers,
      body,
    });
  } catch (err) {
    console.error('[BFF] Upstream fetch error:', err);
    return NextResponse.json(
      { error: 'Servizio API non raggiungibile. Riprova tra qualche istante.' },
      { status: 502 },
    );
  }

  const responseBody = await upstream.text();
  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: {
      'Content-Type': upstream.headers.get('content-type') ?? 'application/json',
    },
  });
}

/** Esportazione `GET` — vedi implementazione sotto. */
export async function GET(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}

/** Esportazione `POST` — vedi implementazione sotto. */
export async function POST(request: NextRequest, context: RouteContext) {
  return proxy(request, context);
}
