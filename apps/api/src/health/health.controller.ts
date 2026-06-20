/**
 * Health check API — liveness (processo vivo) e readiness (dipendenze pronte).
 */
import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { sql } from 'drizzle-orm';
import { MVP_VERSION } from '@varco/shared';
import { type Database } from '@varco/database';
import { Public } from '../auth/decorators.js';
import { DATABASE } from '../database/database.module.js';

@ApiTags('health')
@Controller('health')
/** Esportazione `HealthController` — vedi implementazione sotto. */
export class HealthController {
  constructor(@Inject(DATABASE) private readonly db: Database) {}

  /** Liveness — il processo risponde (nessun check dipendenze). */
  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Liveness probe' })
  @ApiOkResponse({ description: 'Processo attivo' })
  getLive() {
    return {
      status: 'ok',
      service: '@varco/api',
      mvpVersion: MVP_VERSION,
      framework: 'nestjs',
    };
  }

  /** Readiness — verifica connettività PostgreSQL prima di accettare traffico. */
  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Readiness probe' })
  @ApiOkResponse({ description: 'Servizio pronto' })
  async getReady() {
    try {
      await this.db.execute(sql`SELECT 1`);
      return { status: 'ok', database: 'connected' };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'unavailable',
        database: 'disconnected',
        reason: error instanceof Error ? error.message : 'unknown',
      });
    }
  }

  /** Retrocompatibilità — alias di /health/live. */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Health check API (alias live)' })
  getHealth() {
    return this.getLive();
  }
}
