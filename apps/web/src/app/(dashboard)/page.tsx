import { api } from '@/lib/api';
import { getSession } from '@/lib/session';
import styles from '@/components/ui/ui.module.css';
import pageStyles from './page.module.css';

export default async function OverviewPage() {
  const session = await getSession();
  if (!session) return null;

  const [skus, checklist] = await Promise.all([
    api.listSkus(session.organizationId).catch(() => ({ skus: [], total: 0 })),
    api.listChecklist(session.organizationId).catch(() => ({ items: [], total: 0 })),
  ]);

  const openItems = checklist.items.filter((i) =>
    ['open', 'in_progress', 'needs_review'].includes(i.status),
  ).length;
  const critical = checklist.items.filter((i) => i.severity === 'critical').length;

  return (
    <div>
      <h1 className={pageStyles.heading}>Panoramica</h1>
      <p className={pageStyles.lead}>
        Benvenuto in <strong>{session.organizationName}</strong>. Monitora SKU, obblighi e documenti
        GPSR per i mercati UE.
      </p>

      <div className={pageStyles.stats}>
        <div className={styles.card}>
          <p className={pageStyles.statLabel}>SKU in catalogo</p>
          <p className={`${pageStyles.statValue} tnum`}>{skus.total}</p>
        </div>
        <div className={styles.card}>
          <p className={pageStyles.statLabel}>Azioni checklist aperte</p>
          <p className={`${pageStyles.statValue} tnum`}>{openItems}</p>
        </div>
        <div className={styles.card}>
          <p className={pageStyles.statLabel}>Obblighi critical</p>
          <p className={`${pageStyles.statValue} tnum`} style={{ color: 'var(--color-critical)' }}>
            {critical}
          </p>
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1rem' }}>
        <h2 className={pageStyles.sectionTitle}>Flusso rapido</h2>
        <ol className={pageStyles.steps}>
          <li>
            <strong>Catalogo</strong> — sincronizza prodotti dal mock Shopify
          </li>
          <li>
            <strong>SKU</strong> — classifica ogni variante (mock LLM → matrice)
          </li>
          <li>
            <strong>Checklist</strong> — rivedi obblighi per paese
          </li>
          <li>
            <strong>PDF</strong> — genera risk assessment e scarica da MinIO
          </li>
        </ol>
      </div>
    </div>
  );
}
