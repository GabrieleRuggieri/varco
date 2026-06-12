import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, desc, eq } from 'drizzle-orm';
import { getDownloadUrl } from '@varco/documents';
import { documents, products, skus, type Database } from '@varco/database';
import type { DocumentTemplateId } from '@varco/shared';
import { DATABASE } from '../database/database.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class DocumentsService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly queueService: QueueService,
  ) {}

  async listBySku(organizationId: string, skuId: string) {
    await this.assertSkuInOrg(organizationId, skuId);

    return this.db
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
      .orderBy(desc(documents.createdAt));
  }

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

  async getDownloadUrl(organizationId: string, documentId: string) {
    const [row] = await this.db
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
      .where(and(eq(documents.id, documentId), eq(products.organizationId, organizationId)))
      .limit(1);

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

  private async assertSkuInOrg(organizationId: string, skuId: string) {
    const [row] = await this.db
      .select({ id: skus.id })
      .from(skus)
      .innerJoin(products, eq(skus.productId, products.id))
      .where(and(eq(skus.id, skuId), eq(products.organizationId, organizationId)))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`SKU ${skuId} non trovato`);
    }
  }
}
