import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { catalogConnections, type Database } from '@varco/database';
import { DATABASE } from '../database/database.module';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class CatalogService {
  constructor(
    @Inject(DATABASE) private readonly db: Database,
    private readonly queueService: QueueService,
  ) {}

  async listConnections(organizationId: string) {
    return this.db
      .select()
      .from(catalogConnections)
      .where(eq(catalogConnections.organizationId, organizationId));
  }

  async triggerSync(organizationId: string, connectionId?: string) {
    if (connectionId) {
      const [connection] = await this.db
        .select({ id: catalogConnections.id })
        .from(catalogConnections)
        .where(
          and(
            eq(catalogConnections.id, connectionId),
            eq(catalogConnections.organizationId, organizationId),
          ),
        )
        .limit(1);

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
