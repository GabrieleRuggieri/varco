/**
 * Servizio catalogo — connessioni marketplace e trigger sync.
 * Tutte le query passano da withOrgContext per enforcement RLS PostgreSQL.
 */
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { catalogConnections, withOrgContext, type Database } from '@varco/database';
import { DATABASE } from '../database/database.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
/** Esportazione `CatalogService` — vedi implementazione sotto. */
export class CatalogService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly queueService: QueueService,
  ) {}

  /** Elenco connessioni catalogo visibili per il tenant corrente. */
  async listConnections(organizationId: string) {
    return withOrgContext(this.db, organizationId, (tx) =>
      tx.select().from(catalogConnections),
    );
  }

  /** Accoda job catalog.sync dopo verifica ownership connessione. */
  async triggerSync(organizationId: string, connectionId?: string) {
    if (connectionId) {
      const [connection] = await withOrgContext(this.db, organizationId, (tx) =>
        tx
          .select({ id: catalogConnections.id })
          .from(catalogConnections)
          .where(eq(catalogConnections.id, connectionId))
          .limit(1),
      );

      if (!connection) {
        throw new NotFoundException(`Connessione catalogo ${connectionId} non trovata`);
      }
    }

    const job = await this.queueService.enqueueCatalogSync({
      organizationId,
      connectionId,
    });

    return {
      jobId: job.id,
      jobName: job.name,
      status: 'queued' as const,
      organizationId,
      connectionId: connectionId ?? null,
    };
  }
}
