/**
 * Entry point worker — skeleton fase 1.
 * BullMQ e job catalogo/classificazione/documenti in fase successiva.
 */
import { MVP_VERSION } from '@varco/shared';

console.log(`[worker] avviato — MVP ${MVP_VERSION} (skeleton, nessun job in coda)`);

// Mantieni il processo attivo in dev
process.stdin.resume();
