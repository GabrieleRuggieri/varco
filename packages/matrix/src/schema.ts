import { z } from 'zod';

/** Valori allineati a @varco/shared e enum PostgreSQL */
const countryCode = z.enum(['DE', 'FR', 'IT', 'ES', 'NL']);
const productCategory = z.enum(['toys', 'apparel', 'electronics_accessories', 'cosmetics', 'home']);
const obligationType = z.enum([
  'responsible_person',
  'technical_file',
  'declaration_of_conformity',
  'labeling',
  'epr_packaging',
  'product_safety_assessment',
]);
const severityLevel = z.enum(['critical', 'high', 'medium', 'low']);
const matrixReviewStatus = z.enum(['bozza', 'revisionata', 'approvata']);

/** Singola regola obbligo nella matrice */
export const obligationRuleSchema = z
  .object({
    id: z
      .string()
      .min(3)
      .regex(/^[a-z0-9_]+$/, 'id: solo minuscole, numeri e underscore'),
    countries: z.array(countryCode).min(1),
    product_categories: z.array(productCategory).min(1),
    obligation_type: obligationType,
    severity: severityLevel,
    regulation_ref: z.string().min(3),
    deadline_type: z.string().min(3),
    checklist_template_id: z.string().optional(),
    document_templates: z.array(z.string()).default([]),
    effective_from: z.string().date(),
    review_status: matrixReviewStatus.default('bozza'),
    notes: z.string().optional(),
  })
  .strict();

/** Bundle YAML completo della matrice */
export const matrixBundleSchema = z
  .object({
    version: z.string().min(1),
    disclaimer: z.string().optional(),
    rules: z.array(obligationRuleSchema).min(1),
  })
  .strict()
  .superRefine((bundle, ctx) => {
    const ids = new Set<string>();
    for (const rule of bundle.rules) {
      if (ids.has(rule.id)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `id duplicato: ${rule.id}`,
          path: ['rules'],
        });
      }
      ids.add(rule.id);
    }
  });

export type MatrixBundle = z.infer<typeof matrixBundleSchema>;
export type ObligationRuleInput = z.infer<typeof obligationRuleSchema>;
