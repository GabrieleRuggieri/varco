/**
 * Pagina o route Next.js `page` — UI dashboard Varco.
 */
import type { Metadata } from 'next';
import { ProjectGuide } from '@/components/guide/ProjectGuide';

/** Esportazione `metadata` — vedi implementazione sotto. */
export const metadata: Metadata = {
  title: 'Guida — Varco',
  description:
    'Guida completa al progetto Varco: cosa fa, flusso compliance, dashboard e architettura del software.',
};

export default function GuidaPage() {
  return <ProjectGuide />;
}
