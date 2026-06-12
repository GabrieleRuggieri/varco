import { Module } from '@nestjs/common';
import { CatalogModule } from './catalog/catalog.module';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PartnerModule } from './partner/partner.module';
import { QueueModule } from './queue/queue.module';
import { SkusModule } from './skus/skus.module';

@Module({
  imports: [
    DatabaseModule,
    QueueModule,
    HealthModule,
    OrganizationsModule,
    CatalogModule,
    SkusModule,
    PartnerModule,
  ],
})
export class AppModule {}
