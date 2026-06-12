import { Global, Module } from '@nestjs/common';
import { createDb, type Database } from '@varco/database';

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
export class DatabaseModule {}
