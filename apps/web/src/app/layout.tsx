import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Varco — Compliance per vendere in Europa',
  description:
    'Checklist obblighi per SKU, documenti GPSR e orchestrazione RP/EPR per brand e seller UE.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="it" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
