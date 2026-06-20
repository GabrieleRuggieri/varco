/**
 * Logger strutturato JSON (Pino) condiviso tra API, worker e web server-side.
 * In produzione livello info; in sviluppo debug per troubleshooting locale.
 */
import pino from 'pino';

const level = process.env.LOG_LEVEL ?? (process.env.NODE_ENV === 'production' ? 'info' : 'debug');

/** Istanza root — usare child({ traceId }) per request-scoped logging. */
export const logger = pino({
  level,
  base: { service: process.env.VARCO_SERVICE ?? 'varco' },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label }),
  },
});

/** Crea logger figlio con correlation ID per tracciare una singola richiesta. */
export function createRequestLogger(traceId: string, extra?: Record<string, unknown>) {
  return logger.child({ traceId, ...extra });
}

/** Esportazione `VarcoLogger` — vedi implementazione sotto. */
export type VarcoLogger = typeof logger;
