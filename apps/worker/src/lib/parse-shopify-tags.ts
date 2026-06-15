import type { CountryCode, ProductCategory } from '@varco/shared';
import { MVP_COUNTRIES, MVP_PRODUCT_CATEGORIES } from '@varco/shared';

export type ParsedShopifyTags = {
  categoryHint: ProductCategory | null;
  materials: string[];
  targetCountries: CountryCode[];
};

const MVP_COUNTRY_SET = new Set<string>(MVP_COUNTRIES);
const MVP_CATEGORY_SET = new Set<string>(MVP_PRODUCT_CATEGORIES);

const TAG_SEGMENT_RE = /,\s*(?=varco_category:|materials:|target_countries:)/;

/** Estrae attributi Varco dai tag Shopify (`varco_category:`, `materials:`, `target_countries:`). */
export function parseShopifyTags(tags: string): ParsedShopifyTags {
  const result: ParsedShopifyTags = {
    categoryHint: null,
    materials: [],
    targetCountries: [],
  };

  const segments = tags.split(TAG_SEGMENT_RE);

  for (const segment of segments) {
    const part = segment.trim();
    if (!part.includes(':')) continue;

    const colonIndex = part.indexOf(':');
    const key = part.slice(0, colonIndex).trim();
    const value = part.slice(colonIndex + 1).trim();
    if (!value) continue;

    switch (key) {
      case 'varco_category':
        if (MVP_CATEGORY_SET.has(value)) {
          result.categoryHint = value as ProductCategory;
        }
        break;
      case 'materials':
        result.materials = value
          .split(',')
          .map((m) => m.trim())
          .filter(Boolean);
        break;
      case 'target_countries':
        result.targetCountries = value
          .split(',')
          .map((c) => c.trim().toUpperCase())
          .filter((c): c is CountryCode => MVP_COUNTRY_SET.has(c));
        break;
      default:
        break;
    }
  }

  return result;
}
