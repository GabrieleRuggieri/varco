import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ProductCategory } from '@varco/shared';
import { MVP_PRODUCT_CATEGORIES } from '@varco/shared';
import {
  structuredClassificationSchema,
  type SkuClassificationContext,
  type StructuredClassification,
} from './schema.js';

const MVP_CATEGORY_SET = new Set<string>(MVP_PRODUCT_CATEGORIES);

type FixtureMap = Record<string, StructuredClassification>;

let cachedFixtures: FixtureMap | null = null;

export function resolveFixturesDir(): string {
  if (process.env.FIXTURES_DIR) {
    return process.env.FIXTURES_DIR;
  }
  return path.resolve(process.cwd(), 'fixtures');
}

async function loadFixtureMap(): Promise<FixtureMap> {
  if (cachedFixtures) return cachedFixtures;

  const filePath = path.join(resolveFixturesDir(), 'llm-classifications', 'by-sku-code.json');
  const raw = await readFile(filePath, 'utf8');
  const parsed = JSON.parse(raw) as Record<string, unknown>;

  const map: FixtureMap = {};
  for (const [skuCode, value] of Object.entries(parsed)) {
    map[skuCode] = structuredClassificationSchema.parse(value);
  }
  cachedFixtures = map;
  return map;
}

/** Reset cache — utile nei test. */
export function resetMockClassificationCache(): void {
  cachedFixtures = null;
}

function fallbackFromProduct(ctx: SkuClassificationContext): StructuredClassification {
  const category =
    ctx.categoryHint && MVP_CATEGORY_SET.has(ctx.categoryHint)
      ? (ctx.categoryHint as ProductCategory)
      : 'home';

  return {
    product_category: category,
    confidence: ctx.categoryHint ? 0.82 : 0.62,
    materials: ctx.materials ?? [],
    evidence_snippets: ctx.productTitle ? [ctx.productTitle.slice(0, 120)] : [],
  };
}

/** Provider mock — fixture per SKU code, fallback su category_hint prodotto. */
export async function classifyWithMock(
  ctx: SkuClassificationContext,
): Promise<StructuredClassification> {
  try {
    const fixtures = await loadFixtureMap();
    const hit = fixtures[ctx.skuCode];
    if (hit) return hit;
  } catch {
    // Fixture assente in CI/minimal env — usa fallback
  }
  return fallbackFromProduct(ctx);
}
