/**
 * Modulo API NestJS `decorators` — backend compliance Varco.
 */
import { SetMetadata } from '@nestjs/common';

/** Esportazione `IS_PUBLIC_KEY` — vedi implementazione sotto. */
export const IS_PUBLIC_KEY = 'isPublic';
/** Esportazione `Public` — vedi implementazione sotto. */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/** Esportazione `WEBHOOK_AUTH_KEY` — vedi implementazione sotto. */
export const WEBHOOK_AUTH_KEY = 'webhookAuth';
/** Esportazione `WebhookAuth` — vedi implementazione sotto. */
export const WebhookAuth = () => SetMetadata(WEBHOOK_AUTH_KEY, true);
