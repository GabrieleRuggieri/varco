import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { ApiAccessTokenPayload } from '@varco/auth';

export type RequestUser = ApiAccessTokenPayload;

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): RequestUser => {
    const request = ctx.switchToHttp().getRequest<{ user: RequestUser }>();
    return request.user;
  },
);
