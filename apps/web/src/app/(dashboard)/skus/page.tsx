import { SkuActions } from '@/components/SkuActions';
import styles from '@/components/ui/ui.module.css';
import { api } from '@/lib/api';
import { IconList } from '@/components/icons';

export default async function SkusPage() {
  const result = await api.listSkus().catch((err: unknown) => err);
  const apiError = result instanceof Error ? result.message : null;
  const { skus, total } = apiError
    ? { skus: [], total: 0 }
    : (result as Awaited<ReturnType<typeof api.listSkus>>);

  return (
    <div>
      {apiError && (
        <p className={styles.alertError} style={{ margin: '0 0 1rem' }}>
          {apiError}
        </p>
      )}
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderLeft}>
          <p className={styles.pageEyebrow}>Prodotti</p>
          <h1 className={styles.pageTitle}>SKU</h1>
          <p className={styles.pageLead}>
            {total > 0
              ? `${total} varianti nel catalogo — classifica per generare checklist e PDF risk assessment`
              : 'Nessuno SKU ancora — sincronizza prima il catalogo'}
          </p>
        </div>
        {total > 0 && (
          <div className={styles.pageActions}>
            <span className={styles.badge}>{total} varianti</span>
          </div>
        )}
      </div>

      <div className={styles.card}>
        {skus.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIconWrap}>
              <IconList size={22} />
            </div>
            <p className={styles.emptyStateTitle}>Catalogo vuoto</p>
            <p className={styles.emptyStateBody}>
              Vai su <strong>Catalogo</strong> e sincronizza il mock Shopify per importare i
              prodotti.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Codice SKU</th>
                  <th>Prodotto</th>
                  <th>Categoria</th>
                  <th>Paesi target</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => (
                  <tr key={sku.id}>
                    <td className="tnum">
                      <span className={styles.code}>{sku.skuCode}</span>
                    </td>
                    <td style={{ color: 'var(--color-ink)', fontWeight: 500 }}>
                      {sku.productTitle}
                    </td>
                    <td>
                      {sku.categoryHint ? (
                        <span className={styles.pillTag}>{sku.categoryHint}</span>
                      ) : (
                        <span style={{ color: 'var(--color-ink-tertiary)' }}>—</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {sku.targetCountries.map((c) => (
                          <span key={c} className={styles.pillTag}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <SkuActions skuId={sku.id} skuCode={sku.skuCode} />
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
