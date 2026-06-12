'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getApiBaseUrl } from '@/lib/config';
import styles from './ui/ui.module.css';

type Props = {
  organizationId: string;
  skuId: string;
  skuCode: string;
};

export function SkuActions({ organizationId, skuId, skuCode }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function post(path: string, body: unknown, label: string) {
    setBusy(label);
    setMessage(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { jobId?: string };
      if (!res.ok) throw new Error('Richiesta fallita');
      setMessage(`${label}: job ${data.jobId ?? 'accodato'} — attendi e ricarica`);
      router.refresh();
    } catch {
      setMessage(`Errore: ${label}`);
    } finally {
      setBusy(null);
    }
  }

  async function downloadLatest() {
    setBusy('download');
    setMessage(null);
    try {
      const listRes = await fetch(
        `${getApiBaseUrl()}/skus/${skuId}/documents?organizationId=${organizationId}`,
      );
      const list = (await listRes.json()) as { documents: { id: string }[] };
      const doc = list.documents[0];
      if (!doc) {
        setMessage('Nessun documento — genera prima il risk assessment');
        return;
      }
      const dlRes = await fetch(
        `${getApiBaseUrl()}/documents/${doc.id}/download?organizationId=${organizationId}`,
      );
      const dl = (await dlRes.json()) as { downloadUrl: string };
      window.open(dl.downloadUrl, '_blank', 'noopener,noreferrer');
    } catch {
      setMessage('Download non riuscito — MinIO attivo?');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
      <button
        type="button"
        className={styles.secondary}
        disabled={!!busy}
        onClick={() =>
          void post(`/skus/${skuId}/classify`, { organizationId }, `Classifica ${skuCode}`)
        }
      >
        Classifica
      </button>
      <button
        type="button"
        className={styles.secondary}
        disabled={!!busy}
        onClick={() =>
          void post(
            `/skus/${skuId}/documents`,
            { organizationId, templateId: 'risk_assessment' },
            `PDF ${skuCode}`,
          )
        }
      >
        Genera PDF
      </button>
      <button
        type="button"
        className={styles.ghost}
        disabled={!!busy}
        onClick={() => void downloadLatest()}
      >
        Scarica PDF
      </button>
      {message ? (
        <p className={styles.alert} style={{ width: '100%', margin: '0.35rem 0 0', fontSize: 12 }}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
