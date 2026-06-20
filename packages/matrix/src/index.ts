/**
 * Package condiviso `index` — logica riusabile nel monorepo Varco.
 */
export { matrixBundleSchema, obligationRuleSchema } from './schema.js';
export type { MatrixBundle, ObligationRuleInput } from './schema.js';
export { loadMatrixBundle, parseMatrixBundle, DEFAULT_MATRIX_PATH } from './load.js';
export { matchRules, type ClassificationInput, type MatchRulesOptions } from './engine.js';
export { hashMatrixBundle } from './hash.js';
export { mapDbObligationRule } from './db-mapper.js';
export { loadLatestMatrixRules, type LoadedMatrixRules } from './load-from-db.js';
