import type { LlmProvider } from '@varco/shared';
import { classifyWithMock } from './mock-provider.js';
import type { SkuClassificationContext, StructuredClassification } from './schema.js';

export type ClassifyOptions = {
  provider?: LlmProvider;
};

/** Classifica SKU con il provider configurato (default: env LLM_PROVIDER o mock). */
export async function classifySku(
  ctx: SkuClassificationContext,
  options: ClassifyOptions = {},
): Promise<StructuredClassification> {
  const provider = options.provider ?? (process.env.LLM_PROVIDER as LlmProvider | undefined) ?? 'mock';

  switch (provider) {
    case 'mock':
      return classifyWithMock(ctx);
    case 'ollama':
    case 'openai':
      throw new Error(`Provider LLM "${provider}" non ancora implementato — usa mock in sviluppo`);
    default:
      return classifyWithMock(ctx);
  }
}
