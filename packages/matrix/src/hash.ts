import { createHash } from 'node:crypto';
import type { MatrixBundle } from './schema.js';

/** Hash deterministico del bundle per versioning immutabile */
export function hashMatrixBundle(bundle: MatrixBundle): string {
  const canonical = JSON.stringify({
    version: bundle.version,
    rules: bundle.rules.map((r) => ({
      ...r,
      countries: [...r.countries].sort(),
      product_categories: [...r.product_categories].sort(),
      document_templates: [...r.document_templates].sort(),
    })),
  });
  return createHash('sha256').update(canonical).digest('hex');
}
