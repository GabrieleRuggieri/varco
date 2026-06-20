/**
 * Servizio documenti — lista, generazione PDF e URL download firmati.
 * RLS garantisce che un tenant non acceda a documenti di altri.
 */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { getDownloadUrl } from '@varco/documents';
import { documents, products, skus, withOrgContext, type Database } from '@varco/database';
import type { DocumentTemplateId } from '@varco/shared';
import { DATABASE } from '../database/database.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
/** Esportazione `DocumentsService` — vedi implementazione sotto. */
export class DocumentsService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly queueService: QueueService,
  ) {}

  /** Documenti generati per uno SKU (verifica ownership implicita via RLS). */
  async listBySku(organizationId: string, skuId: string) {
    await this.assertSkuInOrg(organizationId, skuId);

    return withOrgContext(this.db, organizationId, (tx) =>
      tx
        .select({
          id: documents.id,
          templateId: documents.templateId,
          version: documents.version,
          mimeType: documents.mimeType,
          checksum: documents.checksum,
          createdAt: documents.createdAt,
        })
        .from(documents)
        .where(eq(documents.skuId, skuId))
        .orderBy(desc(documents.createdAt)),
    );
  }

  /** Accoda generazione PDF da template GPSR. */
  async triggerGenerate(organizationId: string, skuId: string, templateId: DocumentTemplateId) {
    await this.assertSkuInOrg(organizationId, skuId);

    const job = await this.queueService.enqueueDocumentGenerate({
      organizationId,
      skuId,
      templateId,
    });

    return {
      jobId: job.id,
      jobName: job.name,
      status: 'queued' as const,
      skuId,
      organizationId,
      templateId,
    };
  }

  /** URL pre-firmato S3/MinIO per download documento. */
  async getDownloadUrl(organizationId: string, documentId: string) {
    const [row] = await withOrgContext(this.db, organizationId, (tx) =>
      tx
        .select({
          id: documents.id,
          storageKey: documents.storageKey,
          templateId: documents.templateId,
          version: documents.version,
          mimeType: documents.mimeType,
        })
        .from(documents)
        .innerJoin(skus, eq(documents.skuId, skus.id))
        .innerJoin(products, eq(skus.productId, products.id))
        .where(eq(documents.id, documentId))
        .limit(1),
    );

    if (!row) {
      throw new NotFoundException(`Documento ${documentId} non trovato`);
    }

    const url = await getDownloadUrl(row.storageKey);

    return {
      documentId: row.id,
      templateId: row.templateId,
      version: row.version,
      mimeType: row.mimeType,
      downloadUrl: url,
      expiresInSeconds: 3600,
    };
  }

  /** Verifica che lo SKU appartenga al tenant prima di operazioni documento. */
  private async assertSkuInOrg(organizationId: string, skuId: string) {
    const [row] = await withOrgContext(this.db, organizationId, (tx) =>
      tx
        .select({ id: skus.id })
        .from(skus)
        .innerJoin(products, eq(skus.productId, products.id))
        .where(eq(skus.id, skuId))
        .limit(1),
    );

    if (!row) {
      throw new NotFoundException(`SKU ${skuId} non trovato`);
    }
  }
}
