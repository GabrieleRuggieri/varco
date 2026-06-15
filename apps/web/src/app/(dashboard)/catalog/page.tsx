import { CatalogSyncButton } from '@/components/CatalogSyncButton';
import styles from '@/components/ui/ui.module.css';
import { api } from '@/lib/api';
import { IconBox, IconSync } from '@/components/icons';

export default async function CatalogPage() {
  const connections = await api.listConnections().catch(() => ({ connections: [] }));

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <p className={styles.pageEyebrow}>Integrazioni</p>
          <h1 className={styles.pageTitle}>Catalogo</h1>
          <p className={styles.pageLead}>
            Sincronizza prodotti e SKU dal mock server Shopify (porta 4010).
          </p>
        </div>
      </div>

      <div className={styles.cardGlow} style={{ marginBottom: '0.75rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <p style={{ margin: '0 0 3px', fontSize: 14, fontWeight: 600, color: 'var(--color-ink-muted)' }}>
              Shopify Mock
            </p>
            <p style={{ margin: 0, fontSize: 12, color: 'var(--color-ink-subtle)' }}>
              Mock server · localhost:4010 · connessione attiva
            </p>
          </div>
          <CatalogSyncButton />
        </div>
      </div>

      <div className={styles.card}>
        {connections.connections.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIconWrap}>
              <IconBox size={22} />
            </div>
            <p className={styles.emptyStateTitle}>Nessuna connessione</p>
            <p className={styles.emptyStateBody}>
              Avvia la prima sincronizzazione per registrare la connessione Shopify.
            </p>
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Ultimo sync</th>
              </tr>
            </thead>
            <tbody>
              {connections.connections.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <IconSync size={13} style={{ color: 'var(--color-success)', opacity: 0.9 }} />
                      <strong style={{ color: 'var(--color-ink)' }}>{c.provider}</strong>
                    </div>
                  </td>
                  <td className="tnum">
                    {c.lastSyncAt ? new Date(c.lastSyncAt).toLocaleString('it-IT') : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
