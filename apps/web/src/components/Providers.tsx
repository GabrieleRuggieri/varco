/**
 * Componente React `Providers` — interfaccia utente Varco.
 */
'use client';

import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';

/** Esportazione `Providers` — vedi implementazione sotto. */
export function Providers({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
