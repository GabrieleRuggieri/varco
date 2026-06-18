# Varco — Progress

Registro di **cosa è stato fatto** sul progetto: documentazione, architettura, implementazione.  
Per il lavoro **ancora da fare** vedi [BACKLOG.md](./BACKLOG.md). Per il flusso del software vedi [CODEMAP.md](./CODEMAP.md).

Aggiornare questo file a fine sessione di lavoro o al merge di PR significative.

**Legenda stato:** `completato` · `in corso` · `pianificato` · `bloccato`

---

## Riepilogo

| Area | Stato | Note |
|------|-------|------|
| Product spec | completato | documento interno (non versionato nel repo) |
| Architettura | completato | [ARCHITECTURE.md](./ARCHITECTURE.md) v1 |
| README esterno | completato | [README.md](./README.md) + varianti multilingua |
| Contributing | completato | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Code map | completato | [CODEMAP.md](./CODEMAP.md) |
| Backlog | completato | [BACKLOG.md](./BACKLOG.md) |
| Monorepo / codice | in corso | Fase 12 auth/CI completata; prossimo: Shopify OAuth, LLM live |
| Docker Compose | completato | postgres, redis, minio, mailhog, mock-server |
| Package database | completato | Drizzle 18 tabelle, migration `0000`–`0002`, seed demo |
| Matrice obblighi seed | completato | `matrix-v0.yaml` — 12 regole in bozza |
| API NestJS | completato | Health, org, catalogo, SKU, checklist, documenti, webhook partner |
| Worker BullMQ | completato | Coda `varco`: sync catalogo, classificazione, documenti |
| API catalogo / SKU | completato | `POST /catalog/sync`, `GET /skus`, `POST /skus/:id/classify` |
| Classification mock | completato | `@varco/classification` + fixture 21 SKU → matrice → checklist |
| Connettori catalogo | completato | Mock server Shopify; API riceve webhook partner |
| Pipeline classificazione | pianificato | Provider astratto: mock / Ollama / OpenAI |
| Generatore documenti GPSR | parziale | Solo `risk_assessment` PDF → MinIO |
| Partner broker (mock) | parziale | Webhook ingest; orchestrazione incompleta |
| Auth + dashboard | completato | Auth.js v5 + JWT API + BFF proxy |
| CI GitHub Actions | completato | lint, test, typecheck, matrix validate, build |
| Design system | completato | [design/replit/DESIGN.md](./design/replit/DESIGN.md) |

**Decisioni MVP confermate (2026-06-12):**
- Auth v1: email/password + sessione demo (`admin@varco.local` / `admin`); OAuth Shopify in fase successiva
- Landing `index.html` statica in root (locale, non versionata); `apps/web` = sola dashboard prodotto
- Fixture catalogo mock: ~20 SKU sulle 5 categorie MVP

---

## Cronologia

### 2026-06-18

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Rinomina `WORK_LOG.md` → `PROGRESS.md` | completato | Separazione progress / backlog / code map |
| `CODEMAP.md` | completato | Flusso end-to-end, API, worker, DB, integrazioni |
| `BACKLOG.md` | completato | Lavoro rimanente prioritizzato (MVP → post-MVP) |
| Link in README e CONTRIBUTING | completato | Documentazione incrociata |

### 2026-06-12

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Analisi product spec IT/EN | completato | Documenti product spec interni (IT/EN) |
| Definizione architettura MVP | completato | Principi, stack, domini, API, modello dati, mock locali |
| Documento `ARCHITECTURE.md` | completato | Vista sistema, mermaid, struttura repo target, env locale |
| Documento `CONTRIBUTING.md` | completato | Setup, PR, standard, regole matrice |
| Decisioni stack | completato | pnpm monorepo, Next.js, NestJS API, PG, Redis, MinIO |
| Identificazione mock | completato | Shopify, Amazon, LLM, partners — DB/Redis/MinIO reali in locale |

**Decisioni architetturali confermate** (vedi [ARCHITECTURE.md](./ARCHITECTURE.md) §15–17):
- API: NestJS separato da Next.js
- Auth: Auth.js v5 + Drizzle adapter
- Connector live: Shopify prima, Amazon mock
- Lingua: italiano (UI, docs, commenti, commit)
- Matrice: workflow `bozza` → `approvata` + ruolo `regulatory_admin`
- LLM: mock (CI) + Ollama opzionale (dev) + OpenAI (staging/prod)

### 2026-06-12 (sessione 2)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Decisioni architetturali | completato | NestJS, Auth.js, IT, Shopify, workflow regulatory |
| Documentazione monorepo + LLM | completato | Aggiunti §16–17 in `ARCHITECTURE.md` |
| Strategia Ollama | completato | Provider opzionale in dev, mock resta default CI |

### 2026-06-12 (sessione 3)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| `README.md` per esterni | completato | Prodotto, MVP, stack, setup |
| Rinomina `ARCHITECTURE.md` | completato | Da `architecture.md`; aggiornati riferimenti |
| Avvio implementazione a fasi | in corso | Branch da `develop`, commit per fase |
| Scaffold monorepo (fase 1) | completato | pnpm, Turborepo, ESLint, Prettier, `.env.example` |
| Docker Compose (fase 2) | completato | PG 16, Redis, MinIO, Mailhog, mock-server Fastify |
| Package database (fase 3) | completato | Schema Drizzle, migration `0000_init`, seed demo |

### 2026-06-12 (sessione 4)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Istruzioni install pnpm | completato | Sezione in CONTRIBUTING |
| Package matrix (fase 4) | completato | Zod, engine match, CLI validate/seed, CHANGELOG |
| Matrice seed v0 | completato | 12 regole GPSR+EPR, tutte `review_status: bozza` |

### 2026-06-12 (sessione 5)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Design system Stripe | completato | Import `design/stripe/DESIGN.md`; `design/README.md` |
| Decisioni fasi 6–11 | completato | Auth email v1; landing statica; fixture ~20 SKU |

### 2026-06-12 (sessione 6)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Mock server catalogo (fase 6) | completato | Fixture 20 prodotti / 21 SKU; OAuth, products API, partner RP/EPR |

### 2026-06-12 (sessione 7)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| API skeleton NestJS (fase 7) | completato | Health, org, partner-webhook, Swagger `/api/docs` |

### 2026-06-12 (sessione 8)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Worker BullMQ (fase 8) | completato | Sync catalogo da mock Shopify; `pnpm worker:enqueue-demo-sync` |

### 2026-06-12 (sessione 9)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| API catalog sync | completato | `POST /api/catalog/sync` accoda job |
| Classification mock (fase 9) | completato | Fixture LLM, `matchRules`, `classification_runs` + `checklist_items` |

### 2026-06-12 (sessione 10)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Documenti PDF (fase 10) | completato | `@varco/documents`, template toys, MinIO |

### 2026-06-12 (sessione 11)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Web MVP (fase 11) | completato | Next.js dashboard; login demo |

### 2026-06-12 (sessione 12)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Design Replit | completato | Tema light warm; IBM Plex Sans |

### 2026-06-18 (sessione 14 — guida interattiva)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Guida `/guida` | completato | Pagina pubblica con walkthrough, bento, animazioni; screenshot da `docs/images/` |
| Login | completato | Form ripristinato; link guida nel footer; route auth invariata |
| Documentazione | completato | `GUIDA.md`, link in README (tutte le lingue), `CODEMAP.md` aggiornato |

### 2026-06-12 (sessione 13 — rilascio demo)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Demo workflow | completato | `pnpm demo:populate`; fix JWT condiviso API/web/worker |
| Documentazione | completato | README con guida dashboard e screenshot in `docs/images/` |
| Merge su `main` | completato | Branch `feat/web-redesign` integrato per demo pubblica |

---

## Template per nuove entry

Copia e compila a fine sessione:

```markdown
### YYYY-MM-DD

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| ... | completato / in corso / pianificato | ... |
```

---

## Collegamenti

- [README](./README.md)
- [Code map](./CODEMAP.md)
- [Backlog](./BACKLOG.md)
- [Architettura](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
- [Design](./design/README.md)
