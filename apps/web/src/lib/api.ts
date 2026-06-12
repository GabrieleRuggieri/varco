import { getApiBaseUrl } from './config';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function parseJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(text || response.statusText, response.status);
  }
  return response.json() as Promise<T>;
}

export type Organization = {
  id: string;
  name: string;
  defaultTargetCountries: string[];
  plan: string;
};

export type SkuRow = {
  id: string;
  skuCode: string;
  targetCountries: string[];
  variantAttrs: Record<string, string>;
  productId: string;
  productTitle: string;
  categoryHint: string | null;
  materials: string[];
};

export type ChecklistRow = {
  id: string;
  skuId: string;
  skuCode: string;
  productTitle: string;
  country: string;
  status: string;
  obligationRuleId: string;
  obligationType: string;
  severity: string;
  regulationRef: string;
  checklistTemplateId: string | null;
};

export type DocumentRow = {
  id: string;
  templateId: string;
  version: string;
  mimeType: string;
  createdAt: string;
};

export const api = {
  async getOrganizations() {
    return parseJson<{ organizations: Organization[] }>(
      await fetch(`${getApiBaseUrl()}/organizations`, { cache: 'no-store' }),
    );
  },

  async listConnections(organizationId: string) {
    return parseJson<{
      connections: { id: string; provider: string; lastSyncAt: string | null }[];
    }>(
      await fetch(
        `${getApiBaseUrl()}/catalog/connections?organizationId=${organizationId}`,
        { cache: 'no-store' },
      ),
    );
  },

  async syncCatalog(organizationId: string) {
    return parseJson<{ jobId: string; status: string }>(
      await fetch(`${getApiBaseUrl()}/catalog/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId }),
      }),
    );
  },

  async listSkus(organizationId: string) {
    return parseJson<{ skus: SkuRow[]; total: number }>(
      await fetch(`${getApiBaseUrl()}/skus?organizationId=${organizationId}`, {
        cache: 'no-store',
      }),
    );
  },

  async classifySku(organizationId: string, skuId: string) {
    return parseJson<{ jobId: string; status: string }>(
      await fetch(`${getApiBaseUrl()}/skus/${skuId}/classify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId }),
      }),
    );
  },

  async generateDocument(organizationId: string, skuId: string, templateId = 'risk_assessment') {
    return parseJson<{ jobId: string; status: string }>(
      await fetch(`${getApiBaseUrl()}/skus/${skuId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ organizationId, templateId }),
      }),
    );
  },

  async listChecklist(organizationId: string, skuId?: string) {
    const params = new URLSearchParams({ organizationId });
    if (skuId) params.set('skuId', skuId);
    return parseJson<{ items: ChecklistRow[]; total: number }>(
      await fetch(`${getApiBaseUrl()}/checklist?${params}`, { cache: 'no-store' }),
    );
  },

  async listDocuments(organizationId: string, skuId: string) {
    return parseJson<{ documents: DocumentRow[]; total: number }>(
      await fetch(`${getApiBaseUrl()}/skus/${skuId}/documents?organizationId=${organizationId}`, {
        cache: 'no-store',
      }),
    );
  },

  async getDocumentDownloadUrl(organizationId: string, documentId: string) {
    return parseJson<{ downloadUrl: string }>(
      await fetch(
        `${getApiBaseUrl()}/documents/${documentId}/download?organizationId=${organizationId}`,
        { cache: 'no-store' },
      ),
    );
  },
};
