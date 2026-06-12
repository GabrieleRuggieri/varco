import { SkuActions } from '@/components/SkuActions';
import styles from '@/components/ui/ui.module.css';
import { api } from '@/lib/api';
import { getSession } from '@/lib/session';
import pageStyles from '../page.module.css';

export default async function SkusPage() {
  const session = await getSession();
  if (!session) return null;

  const { skus, total } = await api.listSkus(session.organizationId).catch(() => ({
    skus: [],
    total: 0,
  }));

  return (
    <div>
      <h1 className={pageStyles.heading}>SKU</h1>
      <p className={pageStyles.lead}>
        {total} varianti nel catalogo. Classifica per generare la checklist, poi il PDF risk
        assessment.
      </p>

      <div className={styles.card}>
        {skus.length === 0 ? (
          <p style={{ margin: 0, color: 'var(--color-ink-mute)' }}>
            Nessuno SKU — vai su Catalogo e sincronizza.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Prodotto</th>
                  <th>Categoria</th>
                  <th>Paesi</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {skus.map((sku) => (
                  <tr key={sku.id}>
                    <td className="tnum">
                      <strong>{sku.skuCode}</strong>
                    </td>
                    <td>{sku.productTitle}</td>
                    <td>{sku.categoryHint ?? '—'}</td>
                    <td>{sku.targetCountries.join(', ')}</td>
                    <td>
                      <SkuActions
                        organizationId={session.organizationId}
                        skuId={sku.id}
                        skuCode={sku.skuCode}
                      />
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
