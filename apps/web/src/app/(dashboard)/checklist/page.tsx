import styles from '@/components/ui/ui.module.css';
import { api } from '@/lib/api';
import { getSession } from '@/lib/session';
import pageStyles from '../page.module.css';

function StatusBadge({ status, severity }: { status: string; severity: string }) {
  if (severity === 'critical') {
    return <span className={styles.badgeCritical}>{status}</span>;
  }
  if (status === 'open' || status === 'in_progress') {
    return <span className={styles.badgeOpen}>{status}</span>;
  }
  return <span className={styles.badge}>{status}</span>;
}

export default async function ChecklistPage() {
  const session = await getSession();
  if (!session) return null;

  const { items, total } = await api.listChecklist(session.organizationId).catch(() => ({
    items: [],
    total: 0,
  }));

  return (
    <div>
      <h1 className={pageStyles.heading}>Checklist</h1>
      <p className={pageStyles.lead}>
        {total} voci obbligo generate dalla matrice. Stati aggiornati dopo classificazione e
        generazione documenti.
      </p>

      <div className={styles.card}>
        {items.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--color-ink-mute)' }}>
            Checklist vuota — classifica almeno uno SKU.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Paese</th>
                  <th>Obbligo</th>
                  <th>Gravità</th>
                  <th>Stato</th>
                  <th>Riferimento</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div>{item.skuCode}</div>
                      <div style={{ fontSize: 12, color: 'var(--color-ink-mute)' }}>
                        {item.productTitle}
                      </div>
                    </td>
                    <td>{item.country}</td>
                    <td>{item.obligationType.replaceAll('_', ' ')}</td>
                    <td>{item.severity}</td>
                    <td>
                      <StatusBadge status={item.status} severity={item.severity} />
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--color-ink-mute)' }}>
                      {item.regulationRef}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
