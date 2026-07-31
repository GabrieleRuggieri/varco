# Varco — Roadmap post-demo

Idee **oltre** la demo tecnica conclusa. Nessun item è bloccante per il pitch o per l’uso dimostrativo locale.

Per ciò che è già implementato vedi [PROGRESS.md](./PROGRESS.md). Per il flusso del software vedi [CODEMAP.md](./CODEMAP.md).

**Legenda:** `idea` · `parziale nella demo` — non sono commitment di release.

---

## Contesto

Il repository è una **proof-of-concept demo** (mock Shopify, mock LLM, un template PDF).  
Questa lista documenta cosa servirebbe per un prodotto reale — non debito aperto della demo.

---

## Possibili evoluzioni (ex P0 prodotto)

| # | Item | Note |
|---|------|------|
| 1 | **Shopify OAuth + connettore live** | Dev store Partner + Admin API; oggi solo mock |
| 2 | **Provider LLM Ollama** | Contratto in `classify.ts` esiste; implementazione assente |
| 3 | **Provider LLM OpenAI** | Stesso contratto `StructuredClassification` del mock |
| 4 | **Partner broker — orchestrazione** | Webhook ingest presente; manca aggiornamento `partner_requests` / checklist |
| 5 | **Checklist — update stato** | UI/API `PATCH` per `open` → `completed` / `waived` |
| 6 | **Template documenti aggiuntivi** | Oltre `risk_assessment`: DoC, fascicolo tecnico, etichetta |
| 7 | **Amazon SP-API** | Stub sul mock-server; non supportato nel worker |

---

## Possibili evoluzioni (produzione)

| # | Item | Note |
|---|------|------|
| 8 | **RBAC `regulatory_admin`** | Approvazione regole matrice |
| 9 | **Matrice — solo regole `approvata` in prod** | Seed attuale: tutte `bozza` |
| 10 | **API admin matrice** | Import versioni, changelog |
| 11 | **Storage token marketplace cifrato** | Se si aggiunge OAuth live |
| 12 | **Osservabilità worker** | Bull Board, metriche, alerting |
| 13 | **Test E2E** | catalog.sync → classify → checklist → PDF |
| 14 | **Email transazionali** | Mailhog in Docker; nessun flusso in app |

---

## Visione prodotto (ex post-MVP)

| # | Feature |
|---|---------|
| 15 | Marketplace shield (sync attributi) |
| 16 | Radar normativo 27 paesi |
| 17 | RAEE / batterie |
| 18 | Workspace agenzie + API pubblica |
| 19 | Billing Stripe |
| 20 | Landing marketing separata da `apps/web` |

---

## Completato nella demo

- [x] Scaffold monorepo (pnpm + Turborepo)
- [x] Docker Compose (PG, Redis, MinIO, Mailhog, mock-server)
- [x] Package database (Drizzle, migrations, seed, RLS helpers)
- [x] Package matrix (validate, seed, 12 regole bozza)
- [x] Mock server catalogo Shopify + partner
- [x] API NestJS (catalogo, SKU, checklist, documenti, webhook)
- [x] Worker BullMQ (3 job types)
- [x] Classification mock → checklist
- [x] PDF risk assessment → MinIO
- [x] Web dashboard (4 pagine + login + guida `/guida`)
- [x] Auth.js + JWT API + BFF proxy
- [x] CI GitHub Actions
- [x] Script `pnpm demo:populate`

---

## Collegamenti

- [Progress](./PROGRESS.md)
- [Code map](./CODEMAP.md)
- [Architettura](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
