#!/usr/bin/env node
/**
 * Aggiunge documentazione JSDoc a tutti i file .ts/.tsx del repository.
 * - Header di modulo se assente
 * - JSDoc su export function/class/const se non già documentati
 *
 * Uso: node scripts/annotate-sources.mjs
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.next',
  '.turbo',
  'coverage',
  'drizzle',
  '.git',
]);
const SKIP_FILES = /\.(test|spec)\.(ts|tsx)$/;

function describeFile(relPath) {
  const parts = relPath.split(path.sep);
  const name = path.basename(relPath, path.extname(relPath));
  if (relPath.includes('apps/web/src/app/')) return `Pagina o route Next.js \`${name}\` — UI dashboard Varco.`;
  if (relPath.includes('apps/web/src/components/')) return `Componente React \`${name}\` — interfaccia utente Varco.`;
  if (relPath.includes('apps/api/src/')) return `Modulo API NestJS \`${name}\` — backend compliance Varco.`;
  if (relPath.includes('apps/worker/src/')) return `Modulo worker \`${name}\` — job asincroni BullMQ.`;
  if (relPath.includes('packages/database/')) return `Modulo database \`${name}\` — schema Drizzle e accesso PostgreSQL.`;
  if (relPath.includes('packages/')) return `Package condiviso \`${name}\` — logica riusabile nel monorepo Varco.`;
  if (relPath.includes('mocks/')) return `Mock \`${name}\` — simulazione servizi esterni per sviluppo locale.`;
  return `Sorgente TypeScript \`${name}\` — progetto Varco.`;
}

function hasModuleDoc(content) {
  return content.trimStart().startsWith('/**') || content.trimStart().startsWith('/*');
}

function ensureModuleDoc(content, relPath) {
  if (hasModuleDoc(content)) return content;
  const desc = describeFile(relPath);
  return `/**\n * ${desc}\n */\n${content}`;
}

function annotateExports(content) {
  const lines = content.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const prev = out[out.length - 1]?.trim() ?? '';
    const match = line.match(/^export\s+(async\s+)?(function|class|const|type|interface)\s+(\w+)/);
    if (match && !prev.endsWith('*/') && !prev.startsWith('//')) {
      const symbol = match[3];
      out.push(`/** Esportazione \`${symbol}\` — vedi implementazione sotto. */`);
    }
    out.push(line);
  }
  return out.join('\n');
}

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, files);
    } else if (/\.(ts|tsx)$/.test(entry.name) && !SKIP_FILES.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

async function main() {
  const files = await walk(ROOT);
  let updated = 0;
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    if (rel.startsWith('scripts/annotate-sources.mjs')) continue;
    const original = await readFile(file, 'utf8');
    let next = ensureModuleDoc(original, rel);
    next = annotateExports(next);
    if (next !== original) {
      await writeFile(file, next);
      updated++;
    }
  }
  console.log(`[annotate] ${updated} file aggiornati su ${files.length} totali`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
