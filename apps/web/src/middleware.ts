/**
 * Sorgente TypeScript `middleware` — progetto Varco.
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function hasSessionCookie(request: NextRequest): boolean {
  return Boolean(
    request.cookies.get('authjs.session-token')?.value ||
    request.cookies.get('__Secure-authjs.session-token')?.value,
  );
}

/** Esportazione `middleware` — vedi implementazione sotto. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/guida') ||
    pathname.startsWith('/api/auth') ||
    pathname === '/favicon.ico';

  if (isPublic) {
    return NextResponse.next();
  }

  if (!hasSessionCookie(request)) {
    const login = new URL('/login', request.url);
    login.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

/** Esportazione `config` — vedi implementazione sotto. */
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
