import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Varco — Compliance per vendere in Europa',
  description:
    'Checklist obblighi per SKU, documenti GPSR e orchestrazione RP/EPR per brand e seller UE.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
