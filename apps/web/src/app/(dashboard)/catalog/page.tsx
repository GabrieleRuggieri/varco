import { CatalogSyncButton } from '@/components/CatalogSyncButton';
import styles from '@/components/ui/ui.module.css';
import { api } from '@/lib/api';
import { getSession } from '@/lib/session';
import pageStyles from '../page.module.css';

export default async function CatalogPage() {
  const session = await getSession();
  if (!session) return null;

  const connections = await api
    .listConnections(session.organizationId)
    .catch(() => ({ connections: [] }));

  return (
    <div>
      <h1 className={pageStyles.heading}>Catalogo</h1>
      <p className={pageStyles.lead}>
        Connetti e sincronizza il catalogo marketplace. In locale usa il mock server Shopify sulla
        porta 4010.
      </p>

      <div className={styles.card}>
        <h2 className={pageStyles.sectionTitle}>Sincronizzazione</h2>
        <CatalogSyncButton organizationId={session.organizationId} />
      </div>

      <div className={styles.card} style={{ marginTop: '1rem' }}>
        <h2 className={pageStyles.sectionTitle}>Connessioni</h2>
        {connections.connections.length === 0 ? (
          <p style={{ color: 'var(--color-ink-subtle)', margin: 0 }}>
            Nessuna connessione ancora — verrà creata al primo sync.
          </p>
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
                  <td>{c.provider}</td>
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
