# Varco — Progress

Registro di **cosa è stato fatto**.  
Il repository è una **demo tecnica conclusa** (proof-of-concept). Per idee oltre la demo vedi [BACKLOG.md](./BACKLOG.md). Per il flusso del software vedi [CODEMAP.md](./CODEMAP.md).

**Legenda stato:** `completato` · `fuori perimetro demo` · `parziale (demo)`

---

## Riepilogo

| Area | Stato | Note |
|------|-------|------|
| Product spec | completato | documento interno (non versionato nel repo) |
| Architettura | completato | [ARCHITECTURE.md](./ARCHITECTURE.md) v1 (target + locale) |
| README esterno | completato | [README.md](./README.md) + varianti multilingua |
| Contributing | completato | [CONTRIBUTING.md](./CONTRIBUTING.md) |
| Code map | completato | [CODEMAP.md](./CODEMAP.md) |
| Roadmap post-demo | completato | [BACKLOG.md](./BACKLOG.md) |
| **Demo monorepo** | **completato** | Congelata: mock-only, pitch dimostrativo |
| Docker Compose | completato | postgres, redis, minio, mailhog, mock-server |
| Package database | completato | Drizzle, migrations, seed demo, RLS helpers |
| Matrice obblighi seed | completato | `matrix-v0.yaml` — 12 regole in bozza |
| API NestJS | completato | Health, org, catalogo, SKU, checklist, documenti, webhook partner |
| Worker BullMQ | completato | Coda `varco`: sync catalogo, classificazione, documenti |
| Classification mock | completato | Fixture 21 SKU → matrice → checklist |
| Connettori catalogo | completato (demo) | Mock server Shopify |
| Generatore documenti | parziale (demo) | Solo `risk_assessment` PDF → MinIO |
| Partner broker | parziale (demo) | Webhook ingest; orchestrazione fuori perimetro |
| Auth + dashboard | completato | Auth.js v5 + JWT API + BFF + `/guida` |
| CI GitHub Actions | completato | lint, test, typecheck, matrix validate, build |
| Design system | completato | [design/replit/DESIGN.md](./design/replit/DESIGN.md) |
| LLM Ollama / OpenAI | fuori perimetro demo | Contratto astratto; non implementati |
| Shopify / Amazon live | fuori perimetro demo | Solo mock |

**Decisioni demo confermate:**
- Auth: email/password demo (`admin@varco.local` / `admin`)
- Catalogo e LLM: esclusivamente mock in locale e CI
- Fixture: ~20 prodotti / 21 SKU sulle 5 categorie MVP
- Scope chiuso: nessuna integrazione marketplace o LLM live richiesta per il pitch

---

## Cronologia

### 2026-07-31

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Freeze demo / pitch | completato | README, PROGRESS, BACKLOG, CODEMAP, guida: demo conclusa mock-only |

### 2026-06-18

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Rinomina `WORK_LOG.md` → `PROGRESS.md` | completato | Separazione progress / backlog / code map |
| `CODEMAP.md` | completato | Flusso end-to-end, API, worker, DB, integrazioni |
| `BACKLOG.md` | completato | Lavoro rimanente prioritizzato (poi riformulato come roadmap post-demo) |
| Guida `/guida` | completato | Walkthrough, bento, screenshot |

### 2026-06-12 (sintesi fasi 1–13)

Scaffold monorepo → Docker → database → matrix → mock-server → API NestJS → worker BullMQ → classification mock → PDF MinIO → web dashboard → design Replit → `pnpm demo:populate` e merge demo su `main`.

Dettaglio sessioni storiche nelle revisioni git di questo file.

---

## Collegamenti

- [README](./README.md)
- [Code map](./CODEMAP.md)
- [Roadmap post-demo](./BACKLOG.md)
- [Architettura](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
- [Design](./design/README.md)
