import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, asc, desc, eq } from 'drizzle-orm';
import { classificationRuns, products, skus, type Database } from '@varco/database';
import { DATABASE } from '../database/database.module';
import { type QueueService } from '../queue/queue.service';

@Injectable()
export class SkusService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly queueService: QueueService,
  ) {}

  async listByOrganization(organizationId: string) {
    const rows = await this.db
      .select({
        id: skus.id,
        skuCode: skus.skuCode,
        targetCountries: skus.targetCountries,
        variantAttrs: skus.variantAttrs,
        productId: products.id,
        productTitle: products.title,
        categoryHint: products.categoryHint,
        materials: products.materials,
      })
      .from(skus)
      .innerJoin(products, eq(skus.productId, products.id))
      .where(eq(products.organizationId, organizationId))
      .orderBy(asc(products.title), asc(skus.skuCode));

    return rows;
  }

  async triggerClassify(organizationId: string, skuId: string) {
    const [row] = await this.db
      .select({ id: skus.id })
      .from(skus)
      .innerJoin(products, eq(skus.productId, products.id))
      .where(and(eq(skus.id, skuId), eq(products.organizationId, organizationId)))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`SKU ${skuId} non trovato`);
    }

    const job = await this.queueService.enqueueSkuClassify({ organizationId, skuId });

    return {
      jobId: job.id,
      jobName: job.name,
      status: 'queued' as const,
      skuId,
      organizationId,
    };
  }

  async getLatestClassification(organizationId: string, skuId: string) {
    const [row] = await this.db
      .select({
        run: classificationRuns,
      })
      .from(classificationRuns)
      .innerJoin(skus, eq(classificationRuns.skuId, skus.id))
      .innerJoin(products, eq(skus.productId, products.id))
      .where(and(eq(classificationRuns.skuId, skuId), eq(products.organizationId, organizationId)))
      .orderBy(desc(classificationRuns.createdAt))
      .limit(1);

    if (!row) {
      throw new NotFoundException(`Nessuna classificazione per SKU ${skuId}`);
    }

    return row.run;
  }
}
