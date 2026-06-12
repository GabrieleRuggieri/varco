import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { PartnerModule } from './partner/partner.module';

@Module({
  imports: [DatabaseModule, HealthModule, OrganizationsModule, PartnerModule],
})
export class AppModule {}
