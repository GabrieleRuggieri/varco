/** Chiave object storage — gerarchia per tenant e versione immutabile. */
export function buildDocumentStorageKey(params: {
  organizationId: string;
  skuId: string;
  templateId: string;
  version: string;
}): string {
  const { organizationId, skuId, templateId, version } = params;
  return `${organizationId}/${skuId}/${templateId}/${version}.pdf`;
}
