import type { Metadata } from 'next';
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Providers } from '@/components/Providers';
import './globals.css';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Varco — Compliance per vendere in Europa',
  description:
    'Checklist obblighi per SKU, documenti GPSR e orchestrazione RP/EPR per brand e seller UE.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" className={`${ibmPlexSans.variable} ${ibmPlexMono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
