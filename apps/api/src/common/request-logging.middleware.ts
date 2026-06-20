/**
 * Middleware NestJS — correlation ID (X-Request-ID) e logging strutturato per request.
 */
import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { createRequestLogger } from '@varco/shared';

/** Esportazione `RequestWithTrace` — vedi implementazione sotto. */
export type RequestWithTrace = Request & {
  traceId: string;
  log: ReturnType<typeof createRequestLogger>;
};

@Injectable()
/** Esportazione `RequestLoggingMiddleware` — vedi implementazione sotto. */
export class RequestLoggingMiddleware implements NestMiddleware {
  use(req: RequestWithTrace, res: Response, next: NextFunction) {
    const traceId = (req.headers['x-request-id'] as string | undefined) ?? randomUUID();
    req.traceId = traceId;
    req.log = createRequestLogger(traceId, {
      method: req.method,
      path: req.originalUrl,
    });
    res.setHeader('X-Request-ID', traceId);

    const start = Date.now();
    req.log.info({ event: 'http.request.start' });

    res.on('finish', () => {
      req.log.info({
        event: 'http.request.finish',
        statusCode: res.statusCode,
        durationMs: Date.now() - start,
      });
    });

    next();
  }
}
