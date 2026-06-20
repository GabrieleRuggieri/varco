/**
 * Modulo database `enums` — schema Drizzle e accesso PostgreSQL.
 */
import { pgEnum } from 'drizzle-orm/pg-core';

/**
 * Enum PostgreSQL — valori allineati a @varco/shared (verificati in test).
 * Definiti localmente per compatibilità con drizzle-kit in fase di generate.
 */
const MVP_COUNTRIES = ['DE', 'FR', 'IT', 'ES', 'NL'] as const;
const MVP_PRODUCT_CATEGORIES = [
  'toys',
  'apparel',
  'electronics_accessories',
  'cosmetics',
  'home',
] as const;
const OBLIGATION_TYPES = [
  'responsible_person',
  'technical_file',
  'declaration_of_conformity',
  'labeling',
  'epr_packaging',
  'product_safety_assessment',
] as const;
const SEVERITY_LEVELS = ['critical', 'high', 'medium', 'low'] as const;
const CHECKLIST_STATUSES = [
  'open',
  'in_progress',
  'blocked',
  'completed',
  'waived',
  'needs_review',
] as const;
const MATRIX_REVIEW_STATUSES = ['bozza', 'revisionata', 'approvata'] as const;

/** Esportazione `countryCodeEnum` — vedi implementazione sotto. */
export const countryCodeEnum = pgEnum('country_code', MVP_COUNTRIES);
/** Esportazione `productCategoryEnum` — vedi implementazione sotto. */
export const productCategoryEnum = pgEnum('product_category', MVP_PRODUCT_CATEGORIES);
/** Esportazione `obligationTypeEnum` — vedi implementazione sotto. */
export const obligationTypeEnum = pgEnum('obligation_type', OBLIGATION_TYPES);
/** Esportazione `severityLevelEnum` — vedi implementazione sotto. */
export const severityLevelEnum = pgEnum('severity_level', SEVERITY_LEVELS);
/** Esportazione `checklistStatusEnum` — vedi implementazione sotto. */
export const checklistStatusEnum = pgEnum('checklist_status', CHECKLIST_STATUSES);
/** Esportazione `matrixReviewStatusEnum` — vedi implementazione sotto. */
export const matrixReviewStatusEnum = pgEnum('matrix_review_status', MATRIX_REVIEW_STATUSES);
/** Esportazione `catalogProviderEnum` — vedi implementazione sotto. */
export const catalogProviderEnum = pgEnum('catalog_provider', ['shopify', 'amazon']);
/** Esportazione `orgRoleEnum` — vedi implementazione sotto. */
export const orgRoleEnum = pgEnum('org_role', ['owner', 'member', 'regulatory_admin']);
/** Esportazione `partnerRequestTypeEnum` — vedi implementazione sotto. */
export const partnerRequestTypeEnum = pgEnum('partner_request_type', ['rp', 'epr_packaging']);
/** Esportazione `partnerRequestStatusEnum` — vedi implementazione sotto. */
export const partnerRequestStatusEnum = pgEnum('partner_request_status', [
  'draft',
  'submitted',
  'processing',
  'active',
  'rejected',
]);
