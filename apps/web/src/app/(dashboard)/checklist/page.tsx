/**
 * Pagina o route Next.js `page` — UI dashboard Varco.
 */
import styles from '@/components/ui/ui.module.css';
import { api } from '@/lib/api';
import { IconCheckSquare } from '@/components/icons';

type Severity = 'critical' | 'high' | 'medium' | 'low';
type Status = 'open' | 'in_progress' | 'needs_review' | 'completed' | string;

function SeverityBadge({ severity }: { severity: Severity | string }) {
  switch (severity) {
    case 'critical':
      return (
        <span className={styles.badgeCritical}>
          <span className={styles.dot} />
          critical
        </span>
      );
    case 'high':
      return (
        <span className={styles.badgeHigh}>
          <span className={styles.dot} />
          high
        </span>
      );
    case 'medium':
      return (
        <span className={styles.badgeMedium}>
          <span className={styles.dot} />
          medium
        </span>
      );
    default:
      return <span className={styles.badge}>{severity}</span>;
  }
}

function StatusBadge({ status }: { status: Status }) {
  switch (status) {
    case 'completed':
      return <span className={styles.badgeSuccess}>{status}</span>;
    case 'in_progress':
      return <span className={styles.badgeOpen}>{status}</span>;
    case 'needs_review':
      return <span className={styles.badgeHigh}>{status}</span>;
    default:
      return <span className={styles.badge}>{status}</span>;
  }
}

const COUNTRY_FLAGS: Record<string, string> = {
  DE: '🇩🇪',
  FR: '🇫🇷',
  IT: '🇮🇹',
  ES: '🇪🇸',
  NL: '🇳🇱',
  GB: '🇬🇧',
  BE: '🇧🇪',
};

export default async function ChecklistPage() {
  const result = await api.listChecklist().catch((err: unknown) => err);
  const apiError = result instanceof Error ? result.message : null;
  const { items, total } = apiError
    ? { items: [], total: 0 }
    : (result as Awaited<ReturnType<typeof api.listChecklist>>);

  const open = items.filter((i) =>
    ['open', 'in_progress', 'needs_review'].includes(i.status),
  ).length;
  const done = items.filter((i) => i.status === 'completed').length;
  const crit = items.filter((i) => i.severity === 'critical').length;

  return (
    <div>
      {apiError && (
        <p className={styles.alertError} style={{ margin: '0 0 1rem' }}>
          {apiError}
        </p>
      )}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <p className={styles.pageEyebrow}>Obblighi</p>
          <h1 className={styles.pageTitle}>Checklist</h1>
          <p className={styles.pageLead}>
            {total > 0
              ? `${total} voci generate dalla matrice · ${open} aperte · ${done} completate · ${crit} critical`
              : 'Nessuna voce — classifica almeno uno SKU per popolare la checklist'}
          </p>
        </div>
        {total > 0 && (
          <div className={styles.pageActions}>
            {crit > 0 && <span className={styles.badgeCritical}>{crit} critical</span>}
            {open > 0 && <span className={styles.badge}>{open} aperte</span>}
          </div>
        )}
      </div>

      <div className={styles.card}>
        {items.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIconWrap}>
              <IconCheckSquare size={22} />
            </div>
            <p className={styles.emptyStateTitle}>Checklist vuota</p>
            <p className={styles.emptyStateBody}>
              Classifica almeno uno SKU dalla pagina <strong>SKU</strong>. La matrice obblighi
              genererà automaticamente le voci.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>SKU · Prodotto</th>
                  <th>Paese</th>
                  <th>Obbligo</th>
                  <th>Gravità</th>
                  <th>Stato</th>
                  <th>Riferimento normativo</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={styles.code} style={{ marginBottom: 3 }}>
                        {item.skuCode}
                      </span>
                      <div style={{ fontSize: 12, color: 'var(--color-ink-subtle)' }}>
                        {item.productTitle}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: 16, marginRight: 6 }}>
                        {COUNTRY_FLAGS[item.country] ?? ''}
                      </span>
                      <span style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>
                        {item.country}
                      </span>
                    </td>
                    <td style={{ color: 'var(--color-ink)', fontWeight: 500, fontSize: 13 }}>
                      {item.obligationType.replaceAll('_', ' ')}
                    </td>
                    <td>
                      <SeverityBadge severity={item.severity} />
                    </td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: 11,
                          color: 'var(--color-ink-subtle)',
                          fontFamily: 'monospace',
                        }}
                      >
                        {item.regulationRef}
                      </span>
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
