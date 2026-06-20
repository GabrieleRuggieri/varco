/**
 * Package condiviso `load` — logica riusabile nel monorepo Varco.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';
import { matrixBundleSchema, type MatrixBundle } from './schema.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Percorso predefinito del bundle seed v0 */
export const DEFAULT_MATRIX_PATH = path.join(__dirname, '..', 'data', 'matrix-v0.yaml');

/** Carica e valida un file YAML matrice */
export async function loadMatrixBundle(filePath = DEFAULT_MATRIX_PATH): Promise<MatrixBundle> {
  const raw = await readFile(filePath, 'utf8');
  const parsed = parse(raw);
  return matrixBundleSchema.parse(parsed);
}

/** Valida un oggetto già parsato (utile nei test) */
export function parseMatrixBundle(data: unknown): MatrixBundle {
  return matrixBundleSchema.parse(data);
}
