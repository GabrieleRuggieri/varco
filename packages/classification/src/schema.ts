import { z } from 'zod';
import { MVP_PRODUCT_CATEGORIES } from '@varco/shared';

const productCategory = z.enum(MVP_PRODUCT_CATEGORIES);

/** Output strutturato LLM — solo attributi prodotto, mai lista obblighi. */
export const structuredClassificationSchema = z
  .object({
    product_category: productCategory,
    confidence: z.number().min(0).max(1),
    materials: z.array(z.string()).default([]),
    target_age_min: z.number().int().nonnegative().optional(),
    is_cosmetic: z.boolean().optional(),
    requires_battery: z.boolean().optional(),
    evidence_snippets: z.array(z.string()).default([]),
  })
  .strict();

export type StructuredClassification = z.infer<typeof structuredClassificationSchema>;

export type SkuClassificationContext = {
  skuCode: string;
  productTitle: string;
  productDescription?: string | null;
  categoryHint?: string | null;
  materials?: string[];
};
