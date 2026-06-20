/**
 * Modulo API NestJS `catalog.module` — backend compliance Varco.
 */
import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';

@Module({
  controllers: [CatalogController],
  providers: [CatalogService],
})
/** Esportazione `CatalogModule` — vedi implementazione sotto. */
export class CatalogModule {}
