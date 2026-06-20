/**
 * Modulo API NestJS `app.module` — backend compliance Varco.
 */
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CatalogModule } from './catalog/catalog.module';
import { ChecklistModule } from './checklist/checklist.module';
import { RequestLoggingMiddleware } from './common/request-logging.middleware';
import { DatabaseModule } from './database/database.module';
import { DocumentsModule } from './documents/documents.module';
import { HealthModule } from './health/health.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PartnerModule } from './partner/partner.module';
import { QueueModule } from './queue/queue.module';
import { SkusModule } from './skus/skus.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    QueueModule,
    HealthModule,
    OrganizationsModule,
    CatalogModule,
    SkusModule,
    DocumentsModule,
    ChecklistModule,
    PartnerModule,
  ],
})
/** Esportazione `AppModule` — vedi implementazione sotto. */
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
