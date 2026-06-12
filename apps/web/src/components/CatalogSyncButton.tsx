'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getApiBaseUrl } from '@/lib/config';
import styles from './ui/ui.module.css';

export function CatalogSyncButton({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sync() {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch(`${getApiBaseUrl()}/catalog/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId }),
      });
      const data = (await res.json()) as { jobId?: string; status?: string };
      if (!res.ok) throw new Error('Sync fallita');
      setStatus(`Job accodato: ${data.jobId ?? 'ok'} — attendi qualche secondo e ricarica SKU`);
      router.refresh();
    } catch {
      setStatus('Errore durante la sincronizzazione. Verifica API e worker attivi.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button type="button" className={styles.primary} onClick={() => void sync()} disabled={loading}>
        {loading ? 'Sincronizzazione…' : 'Sincronizza catalogo Shopify (mock)'}
      </button>
      {status ? <p className={styles.alert} style={{ marginTop: '0.75rem' }}>{status}</p> : null}
    </div>
  );
}
