/**
 * CLI: valida il bundle YAML della matrice obblighi.
 * Uso: pnpm matrix:validate [percorso-file]
 */
import path from 'node:path';
import { loadMatrixBundle, DEFAULT_MATRIX_PATH } from '../load.js';

const filePath = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_MATRIX_PATH;

try {
  const bundle = await loadMatrixBundle(filePath);
  const bozza = bundle.rules.filter((r) => r.review_status === 'bozza').length;
  const approvate = bundle.rules.filter((r) => r.review_status === 'approvata').length;

  console.log('[matrix:validate] OK —', filePath);
  console.log(`  versione: ${bundle.version}`);
  console.log(`  regole: ${bundle.rules.length} (${bozza} bozza, ${approvate} approvate)`);
  if (bundle.disclaimer) {
    console.log(`  disclaimer: ${bundle.disclaimer.slice(0, 80)}...`);
  }
  process.exit(0);
} catch (err) {
  console.error('[matrix:validate] Errore:', err);
  process.exit(1);
}
