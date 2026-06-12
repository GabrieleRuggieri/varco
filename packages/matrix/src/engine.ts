import type { ObligationRuleInput } from './schema.js';

export type ClassificationInput = {
  product_category: ObligationRuleInput['product_categories'][number];
  target_countries: ObligationRuleInput['countries'];
};

export type MatchRulesOptions = {
  /** In produzione: solo regole `approvata`. In development accetta anche `bozza`. */
  environment?: 'development' | 'staging' | 'production';
};

/**
 * Applica lookup matrice su classificazione SKU.
 * L'LLM fornisce solo attributi — questa funzione determina gli obblighi.
 */
export function matchRules(
  rules: ObligationRuleInput[],
  classification: ClassificationInput,
  options: MatchRulesOptions = {},
): ObligationRuleInput[] {
  const env = options.environment ?? process.env.NODE_ENV ?? 'development';

  return rules.filter((rule) => {
    if (env === 'production' && rule.review_status !== 'approvata') {
      return false;
    }
    if (!rule.product_categories.includes(classification.product_category)) {
      return false;
    }
    return rule.countries.some((c) => classification.target_countries.includes(c));
  });
}
