import { api } from '@/lib/api';
import { getSession } from '@/lib/session';
import styles from '@/components/ui/ui.module.css';
import { IconBox, IconCheckSquare, IconDocument, IconWarning } from '@/components/icons';
import pageStyles from './overview.module.css';

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
  const completed = checklist.items.filter((i) => i.status === 'completed').length;

  const stats = [
    {
      label: 'SKU in catalogo',
      value: skus.total,
      icon: IconBox,
      color: 'var(--color-primary-hover)',
    },
    {
      label: 'Azioni aperte',
      value: openItems,
      icon: IconCheckSquare,
      color: 'var(--color-high)',
    },
    {
      label: 'Obblighi critical',
      value: critical,
      icon: IconWarning,
      color: 'var(--color-critical)',
    },
    {
      label: 'Completati',
      value: completed,
      icon: IconDocument,
      color: 'var(--color-success)',
    },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Panoramica</h1>
          <p className={styles.pageLead}>
            {session.organizationName} · Obblighi GPSR + EPR per DE, FR, IT, ES, NL
          </p>
        </div>
      </div>

      <div className={pageStyles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={pageStyles.statCard}>
            <div className={pageStyles.statIcon} style={{ color: s.color }}>
              <s.icon size={18} />
            </div>
            <p className={`${pageStyles.statValue} tnum`}>{s.value}</p>
            <p className={pageStyles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={pageStyles.grid2}>
        <div className={styles.card}>
          <p className={pageStyles.sectionTitle}>Flusso di lavoro</p>
          <ol className={pageStyles.steps}>
            <li>
              <span className={pageStyles.stepNum}>1</span>
              <div>
                <strong>Sincronizza catalogo</strong>
                <span>Importa prodotti e SKU dal mock Shopify</span>
              </div>
            </li>
            <li>
              <span className={pageStyles.stepNum}>2</span>
              <div>
                <strong>Classifica SKU</strong>
                <span>Classificazione AI → matrice obblighi</span>
              </div>
            </li>
            <li>
              <span className={pageStyles.stepNum}>3</span>
              <div>
                <strong>Rivedi checklist</strong>
                <span>Obblighi per paese con gravità</span>
              </div>
            </li>
            <li>
              <span className={pageStyles.stepNum}>4</span>
              <div>
                <strong>Genera PDF</strong>
                <span>Risk assessment e documenti GPSR</span>
              </div>
            </li>
          </ol>
        </div>

        <div className={styles.card}>
          <p className={pageStyles.sectionTitle}>Mercati attivi</p>
          <div className={pageStyles.countryGrid}>
            {[
              { code: 'DE', name: 'Germania', flag: '🇩🇪' },
              { code: 'FR', name: 'Francia', flag: '🇫🇷' },
              { code: 'IT', name: 'Italia', flag: '🇮🇹' },
              { code: 'ES', name: 'Spagna', flag: '🇪🇸' },
              { code: 'NL', name: 'Paesi Bassi', flag: '🇳🇱' },
            ].map((c) => (
              <div key={c.code} className={pageStyles.countryRow}>
                <span className={pageStyles.countryFlag}>{c.flag}</span>
                <div>
                  <p className={pageStyles.countryName}>{c.name}</p>
                  <p className={pageStyles.countryCode}>{c.code}</p>
                </div>
                <span className={styles.pillTag}>GPSR + EPR</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
