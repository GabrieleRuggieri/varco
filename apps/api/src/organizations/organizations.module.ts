/**
 * Modulo API NestJS `organizations.module` — backend compliance Varco.
 */
import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
})
/** Esportazione `OrganizationsModule` — vedi implementazione sotto. */
export class OrganizationsModule {}
