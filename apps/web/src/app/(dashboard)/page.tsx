import Link from 'next/link';
import { api } from '@/lib/api';
import { getSession } from '@/lib/session';
import styles from '@/components/ui/ui.module.css';
import { CompliancePipeline } from '@/components/CompliancePipeline';
import { IconBox, IconCheckSquare, IconDocument, IconWarning } from '@/components/icons';
import pageStyles from './overview.module.css';

export default async function OverviewPage() {
  const session = await getSession();
  if (!session) return null;

  const [skus, checklist] = await Promise.all([
    api.listSkus().catch(() => ({ skus: [], total: 0 })),
    api.listChecklist().catch(() => ({ items: [], total: 0 })),
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
      color: '#2492ff',
      bg: 'rgba(36, 146, 255, 0.08)',
    },
    {
      label: 'Azioni aperte',
      value: openItems,
      icon: IconCheckSquare,
      color: '#ff764c',
      bg: 'rgba(255, 118, 76, 0.1)',
    },
    {
      label: 'Obblighi critical',
      value: critical,
      icon: IconWarning,
      color: '#ff3c00',
      bg: 'rgba(255, 60, 0, 0.08)',
    },
    {
      label: 'Completati',
      value: completed,
      icon: IconDocument,
      color: '#1a9e4a',
      bg: 'rgba(26, 158, 74, 0.08)',
    },
  ];

  return (
    <div>
      <section className={pageStyles.hero}>
        <p className={styles.pageEyebrow}>Compliance GPSR · UE</p>
        <h1 className={pageStyles.heroTitle}>{session.organizationName}</h1>
        <p className={pageStyles.heroLead}>
          Il sistema per obblighi prodotto, checklist per SKU e documenti GPSR — DE, FR, IT, ES, NL.
        </p>
      </section>

      <div className={pageStyles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={pageStyles.statCard}>
            <div
              className={pageStyles.statIcon}
              style={{
                ['--icon-color' as string]: s.color,
                ['--stat-bg' as string]: s.bg,
                color: s.color,
              }}
            >
              <s.icon size={18} />
            </div>
            <p className={`${pageStyles.statValue} tnum`}>{s.value}</p>
            <p className={pageStyles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={styles.cardGlow} style={{ marginBottom: '0.75rem' }}>
        <p className={pageStyles.sectionTitle}>Pipeline compliance</p>
        <p className={pageStyles.sectionSub}>Dal catalogo al documento — il flusso compliance per il GPSR</p>
        <CompliancePipeline />
      </div>

      <div className={pageStyles.grid2}>
        <div className={styles.card}>
          <p className={pageStyles.sectionTitle}>Flusso di lavoro</p>
          <p className={pageStyles.sectionSub}>4 passi per ogni SKU</p>
          <ol className={pageStyles.steps}>
            <li>
              <Link href="/catalog" className={pageStyles.stepLink}>
                <span className={pageStyles.stepNum}>1</span>
                <div>
                  <strong>Sincronizza catalogo</strong>
                  <span>Importa prodotti e SKU dal mock Shopify</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/skus" className={pageStyles.stepLink}>
                <span className={pageStyles.stepNum}>2</span>
                <div>
                  <strong>Classifica SKU</strong>
                  <span>Classificazione AI → matrice obblighi</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/checklist" className={pageStyles.stepLink}>
                <span className={pageStyles.stepNum}>3</span>
                <div>
                  <strong>Rivedi checklist</strong>
                  <span>Obblighi per paese con gravità</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/skus" className={pageStyles.stepLink}>
                <span className={pageStyles.stepNum}>4</span>
                <div>
                  <strong>Genera PDF</strong>
                  <span>Risk assessment e documenti GPSR</span>
                </div>
              </Link>
            </li>
          </ol>
        </div>

        <div className={styles.card}>
          <p className={pageStyles.sectionTitle}>Mercati attivi</p>
          <p className={pageStyles.sectionSub}>5 paesi MVP · GPSR + EPR</p>
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
