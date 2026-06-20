/**
 * Modulo API NestJS `database.module` — backend compliance Varco.
 */
import { Global, Module } from '@nestjs/common';
import { createDb, type Database } from '@varco/database';

/** Esportazione `DATABASE` — vedi implementazione sotto. */
export const DATABASE = Symbol('DATABASE');

@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: (): Database => createDb(),
    },
  ],
  exports: [DATABASE],
})
/** Esportazione `DatabaseModule` — vedi implementazione sotto. */
export class DatabaseModule {}
