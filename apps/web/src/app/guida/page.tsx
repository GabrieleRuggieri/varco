import type { Metadata } from 'next';
import { ProjectGuide } from '@/components/guide/ProjectGuide';

export const metadata: Metadata = {
  title: 'Guida — Varco',
  description:
    'Guida completa al progetto Varco: cosa fa, flusso compliance, dashboard e architettura del software.',
};

export default function GuidaPage() {
  return <ProjectGuide />;
}
