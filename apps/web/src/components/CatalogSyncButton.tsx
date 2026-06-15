'use client';

import { IconSync } from '@/components/icons';
import { useApiPost } from '@/hooks/useApiPost';
import styles from './ui/ui.module.css';

export function CatalogSyncButton() {
  const { message, isError, busy, post } = useApiPost();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'flex-start' }}>
      <button
        type="button"
        className={styles.primary}
        onClick={() =>
          void post('catalog/sync', {}, 'sync', {
            successMessage: (jobId) =>
              `Job accodato (${jobId ?? 'ok'}) · attendi qualche secondo e ricarica la pagina SKU`,
          })
        }
        disabled={!!busy}
      >
        <IconSync size={14} />
        {busy === 'sync' ? 'Sincronizzazione…' : 'Sincronizza ora'}
      </button>
      {message ? (
        <p className={isError ? styles.alertError : styles.alert} style={{ margin: 0, fontSize: 12 }}>
          {message}
        </p>
      ) : null}
    </div>
  );
}
