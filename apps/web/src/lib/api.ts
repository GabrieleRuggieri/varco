import { getApiAccessToken } from './api-auth';
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

async function authFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getApiAccessToken();
  const headers = new Headers(init?.headers);
  headers.set('Authorization', `Bearer ${token}`);
  if (init?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(`${getApiBaseUrl()}${path}`, { ...init, headers, cache: 'no-store' });
}

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
  async listConnections() {
    return parseJson<{
      connections: { id: string; provider: string; lastSyncAt: string | null }[];
    }>(await authFetch('/catalog/connections'));
  },

  async listSkus() {
    return parseJson<{ skus: SkuRow[]; total: number }>(await authFetch('/skus'));
  },

  async listChecklist(skuId?: string) {
    const params = skuId ? `?skuId=${encodeURIComponent(skuId)}` : '';
    return parseJson<{ items: ChecklistRow[]; total: number }>(
      await authFetch(`/checklist${params}`),
    );
  },

  async listDocuments(skuId: string) {
    return parseJson<{ documents: DocumentRow[]; total: number }>(
      await authFetch(`/skus/${skuId}/documents`),
    );
  },

  async getDocumentDownloadUrl(documentId: string) {
    return parseJson<{ downloadUrl: string }>(
      await authFetch(`/documents/${documentId}/download`),
    );
  },
};
