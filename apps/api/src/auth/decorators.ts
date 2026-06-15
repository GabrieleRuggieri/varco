import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const WEBHOOK_AUTH_KEY = 'webhookAuth';
export const WebhookAuth = () => SetMetadata(WEBHOOK_AUTH_KEY, true);
