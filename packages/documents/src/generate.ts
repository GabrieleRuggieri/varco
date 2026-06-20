/**
 * Package condiviso `generate` — logica riusabile nel monorepo Varco.
 */
import { DOCUMENT_TEMPLATE_VERSION, type DocumentTemplateId } from '@varco/shared';
import { buildDocumentStorageKey } from './storage-key.js';
import { uploadPdf } from './storage/s3.js';
import {
  renderRiskAssessmentPdf,
  type RiskAssessmentContext,
} from './templates/risk-assessment-toys.js';

/** Esportazione `GenerateDocumentInput` — vedi implementazione sotto. */
export type GenerateDocumentInput = RiskAssessmentContext & {
  organizationId: string;
  skuId: string;
  version?: string;
};

/** Esportazione `GenerateDocumentResult` — vedi implementazione sotto. */
export type GenerateDocumentResult = {
  storageKey: string;
  version: string;
  checksum: string;
  bytes: number;
  mimeType: 'application/pdf';
};

/** Esportazione `generateDocument` — vedi implementazione sotto. */
export async function generateDocument(
  input: GenerateDocumentInput,
): Promise<GenerateDocumentResult> {
  const version = input.version ?? `${DOCUMENT_TEMPLATE_VERSION}-${Date.now()}`;
  const pdfBuffer = await renderPdf(input.templateId, input);

  const storageKey = buildDocumentStorageKey({
    organizationId: input.organizationId,
    skuId: input.skuId,
    templateId: input.templateId,
    version,
  });

  const { checksum, bytes } = await uploadPdf({
    key: storageKey,
    body: pdfBuffer,
    metadata: {
      skuCode: input.skuCode,
      templateId: input.templateId,
    },
  });

  return {
    storageKey,
    version,
    checksum,
    bytes,
    mimeType: 'application/pdf',
  };
}

async function renderPdf(
  templateId: DocumentTemplateId,
  ctx: RiskAssessmentContext,
): Promise<Buffer> {
  switch (templateId) {
    case 'risk_assessment':
      return renderRiskAssessmentPdf(ctx);
    default: {
      const _exhaustive: never = templateId;
      throw new Error(`Template non supportato: ${String(_exhaustive)}`);
    }
  }
}
