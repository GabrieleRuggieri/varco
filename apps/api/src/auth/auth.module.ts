/**
 * Modulo API NestJS `auth.module` — backend compliance Varco.
 */
import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { JwtAuthGuard, WebhookSecretGuard } from './jwt-auth.guard.js';

@Global()
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 120,
      },
    ]),
  ],
  providers: [
    JwtAuthGuard,
    WebhookSecretGuard,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: WebhookSecretGuard },
  ],
  exports: [JwtAuthGuard],
})
/** Esportazione `AuthModule` — vedi implementazione sotto. */
export class AuthModule {}
