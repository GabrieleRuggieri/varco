import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { verifyApiAccessToken } from '@varco/auth';
import { IS_PUBLIC_KEY, WEBHOOK_AUTH_KEY } from './decorators.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: unknown;
    }>();

    const header = request.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token di accesso mancante');
    }

    const token = header.slice('Bearer '.length).trim();
    try {
      request.user = await verifyApiAccessToken(token);
      return true;
    } catch {
      throw new UnauthorizedException('Token di accesso non valido o scaduto');
    }
  }
}

@Injectable()
export class WebhookSecretGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const needsWebhook = this.reflector.getAllAndOverride<boolean>(WEBHOOK_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!needsWebhook) {
      return true;
    }

    const expected = process.env.PARTNER_WEBHOOK_SECRET;
    if (!expected) {
      throw new UnauthorizedException(
        'PARTNER_WEBHOOK_SECRET non configurato. Imposta la variabile di ambiente.',
      );
    }

    const request = context.switchToHttp().getRequest<{
      headers: Record<string, string | undefined>;
    }>();
    const provided = request.headers['x-varco-webhook-secret'];
    if (!provided || provided !== expected) {
      throw new UnauthorizedException('Webhook secret non valido');
    }
    return true;
  }
}
