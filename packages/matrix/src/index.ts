export { matrixBundleSchema, obligationRuleSchema } from './schema.js';
export type { MatrixBundle, ObligationRuleInput } from './schema.js';
export { loadMatrixBundle, parseMatrixBundle, DEFAULT_MATRIX_PATH } from './load.js';
export { matchRules, type ClassificationInput, type MatchRulesOptions } from './engine.js';
export { hashMatrixBundle } from './hash.js';
