/**
 * Servizio SKU — lista, classificazione e storico classification runs.
 * Isolamento tenant via withOrgContext (RLS) + filtri applicativi.
 */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { asc, desc, eq } from 'drizzle-orm';
import {
  classificationRuns,
  products,
  skus,
  withOrgContext,
  type Database,
} from '@varco/database';
import { DATABASE } from '../database/database.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
/** Esportazione `SkusService` — vedi implementazione sotto. */
export class SkusService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly queueService: QueueService,
  ) {}

  /** SKU del catalogo normalizzato per l'organizzazione attiva. */
  async listByOrganization(organizationId: string) {
    return withOrgContext(this.db, organizationId, (tx) =>
      tx
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
        .orderBy(asc(products.title), asc(skus.skuCode)),
    );
  }

  /** Accoda classificazione AI per uno SKU del tenant. */
  async triggerClassify(organizationId: string, skuId: string) {
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

    const job = await this.queueService.enqueueSkuClassify({ organizationId, skuId });

    return {
      jobId: job.id,
      jobName: job.name,
      status: 'queued' as const,
      skuId,
      organizationId,
    };
  }

  /** Ultima classification run per SKU (se esiste). */
  async getLatestClassification(organizationId: string, skuId: string) {
    const [row] = await withOrgContext(this.db, organizationId, (tx) =>
      tx
        .select({ run: classificationRuns })
        .from(classificationRuns)
        .innerJoin(skus, eq(classificationRuns.skuId, skus.id))
        .innerJoin(products, eq(skus.productId, products.id))
        .where(eq(classificationRuns.skuId, skuId))
        .orderBy(desc(classificationRuns.createdAt))
        .limit(1),
    );

    if (!row) {
      throw new NotFoundException(`Nessuna classificazione per SKU ${skuId}`);
    }

    return row.run;
  }
}
