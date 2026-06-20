/**
 * Componente React `SkuActions` — interfaccia utente Varco.
 */
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconDownload, IconDocument, IconSparkle } from '@/components/icons';
import { useApiPost } from '@/hooks/useApiPost';
import styles from './ui/ui.module.css';

type Props = {
  skuId: string;
  skuCode: string;
};

/** Esportazione `SkuActions` — vedi implementazione sotto. */
export function SkuActions({ skuId, skuCode }: Props) {
  const router = useRouter();
  const { message, isError, busy, post } = useApiPost();
  const [dlMessage, setDlMessage] = useState<string | null>(null);
  const [dlError, setDlError] = useState(false);

  async function downloadLatest() {
    setDlMessage(null);
    setDlError(false);
    try {
      const listRes = await fetch(`/api/v1/skus/${skuId}/documents`);
      const list = (await listRes.json()) as { documents: { id: string }[]; error?: string };
      if (!listRes.ok) throw new Error(list.error ?? 'Errore lista documenti');
      const doc = list.documents[0];
      if (!doc) {
        setDlMessage('Nessun documento — genera prima il risk assessment');
        return;
      }
      const dlRes = await fetch(`/api/v1/documents/${doc.id}/download`);
      const dl = (await dlRes.json()) as { downloadUrl: string; error?: string };
      if (!dlRes.ok) throw new Error(dl.error ?? 'Errore download');
      window.open(dl.downloadUrl, '_blank', 'noopener,noreferrer');
      router.refresh();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setDlMessage(`Download non riuscito — ${msg}`);
      setDlError(true);
    }
  }

  const displayMessage = message ?? dlMessage;
  const displayError = message ? isError : dlError;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      <button
        type="button"
        className={styles.secondary}
        disabled={!!busy}
        onClick={() => void post(`skus/${skuId}/classify`, {}, 'classify')}
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
          void post(`skus/${skuId}/documents`, { templateId: 'risk_assessment' }, 'pdf')
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
      {displayMessage ? (
        <p
          className={displayError ? styles.alertError : styles.alert}
          style={{ width: '100%', margin: '4px 0 0', fontSize: 11 }}
        >
          {displayMessage}
        </p>
      ) : null}
    </div>
  );
}
