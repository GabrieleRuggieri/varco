export {
  generateDocument,
  type GenerateDocumentInput,
  type GenerateDocumentResult,
} from './generate.js';
export { buildDocumentStorageKey } from './storage-key.js';
export { getDownloadUrl, uploadPdf, sha256Hex, resetS3Client } from './storage/s3.js';
export {
  renderRiskAssessmentPdf,
  type RiskAssessmentContext,
} from './templates/risk-assessment-toys.js';
export { getS3Config } from './config.js';
