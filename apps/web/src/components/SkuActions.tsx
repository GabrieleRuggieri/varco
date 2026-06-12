'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getApiBaseUrl } from '@/lib/config';
import { IconDownload, IconDocument, IconSparkle } from '@/components/icons';
import styles from './ui/ui.module.css';

type Props = {
  organizationId: string;
  skuId: string;
  skuCode: string;
};

export function SkuActions({ organizationId, skuId, skuCode }: Props) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  async function post(path: string, body: unknown, label: string) {
    setBusy(label);
    setMessage(null);
    setIsError(false);
    try {
      const res = await fetch(`${getApiBaseUrl()}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as { jobId?: string };
      if (!res.ok) throw new Error('Richiesta fallita');
      setMessage(`Job accodato (${data.jobId ?? 'ok'}) · ricarica tra qualche secondo`);
      router.refresh();
    } catch {
      setMessage(`Errore: ${label}`);
      setIsError(true);
    } finally {
      setBusy(null);
    }
  }

  async function downloadLatest() {
    setBusy('download');
    setMessage(null);
    setIsError(false);
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
      setIsError(true);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      <button
        type="button"
        className={styles.secondary}
        disabled={!!busy}
        onClick={() =>
          void post(`/skus/${skuId}/classify`, { organizationId }, 'classify')
        }
        title={`Classifica ${skuCode}`}
      >
        <IconSparkle size={13} />
        Classifica
      </button>
      <button
        type="button"
        className={styles.secondary}
        disabled={!!busy}
        onClick={() =>
          void post(`/skus/${skuId}/documents`, { organizationId, templateId: 'risk_assessment' }, 'pdf')
        }
        title={`Genera PDF per ${skuCode}`}
      >
        <IconDocument size={13} />
        PDF
      </button>
      <button
        type="button"
        className={styles.ghost}
        disabled={!!busy}
        onClick={() => void downloadLatest()}
        title={`Scarica PDF per ${skuCode}`}
      >
        <IconDownload size={13} />
        Scarica
      </button>
      {message ? (
        <p
          className={isError ? styles.alertError : styles.alert}
          style={{ width: '100%', margin: '4px 0 0', fontSize: 11 }}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
