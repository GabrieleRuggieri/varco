/**
 * Tipi di dominio condivisi tra web, API e worker.
 * I nomi restano in inglese per convenzione del dominio software.
 */

/** Paesi UE coperti dal MVP (ISO 3166-1 alpha-2). */
export const MVP_COUNTRIES = ['DE', 'FR', 'IT', 'ES', 'NL'] as const;
export type CountryCode = (typeof MVP_COUNTRIES)[number];

/** Categorie prodotto coperte dal MVP. */
export const MVP_PRODUCT_CATEGORIES = [
  'toys',
  'apparel',
  'electronics_accessories',
  'cosmetics',
  'home',
] as const;
export type ProductCategory = (typeof MVP_PRODUCT_CATEGORIES)[number];

/** Tipi di obbligo normativo (subset v1). */
export const OBLIGATION_TYPES = [
  'responsible_person',
  'technical_file',
  'declaration_of_conformity',
  'labeling',
  'epr_packaging',
  'product_safety_assessment',
] as const;
export type ObligationType = (typeof OBLIGATION_TYPES)[number];

/** Gravità di un obbligo sulla checklist. */
export const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
export type SeverityLevel = (typeof SEVERITY_LEVELS)[number];

/** Stati operativi di una voce checklist. */
export const CHECKLIST_STATUSES = [
  'open',
  'in_progress',
  'blocked',
  'completed',
  'waived',
  'needs_review',
] as const;
export type ChecklistStatus = (typeof CHECKLIST_STATUSES)[number];

/** Stato di revisione di una regola nella matrice obblighi. */
export const MATRIX_REVIEW_STATUSES = ['bozza', 'revisionata', 'approvata'] as const;
export type MatrixReviewStatus = (typeof MATRIX_REVIEW_STATUSES)[number];

/** Provider LLM supportati. */
export const LLM_PROVIDERS = ['mock', 'ollama', 'openai'] as const;
export type LlmProvider = (typeof LLM_PROVIDERS)[number];

/** Versione corrente del perimetro MVP — usata nei log e nei fixture. */
export const MVP_VERSION = '0.1.0' as const;
