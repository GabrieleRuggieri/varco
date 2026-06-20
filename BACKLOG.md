# Varco — Backlog

Lavoro **ancora da implementare**, ordinato per priorità.  
Per ciò che è già stato fatto vedi [PROGRESS.md](./PROGRESS.md). Per il flusso del software vedi [CODEMAP.md](./CODEMAP.md).

**Legenda:** `P0` bloccante MVP · `P1` produzione · `P2` post-MVP

---

## P0 — Completamento MVP

| # | Item | Stato | Dettaglio |
|---|------|-------|-----------|
| 1 | **Shopify OAuth + connettore live** | pianificato | OAuth reale, token cifrati, Admin API al posto del mock; env `SHOPIFY_API_MODE=live` |
| 2 | **Provider LLM Ollama** | pianificato | Implementare in `packages/classification`; dev locale senza OpenAI |
| 3 | **Provider LLM OpenAI** | pianificato | Staging/prod; stesso contratto `StructuredClassification` del mock |
| 4 | **Partner broker — API orchestrazione** | parziale | `POST/GET /partner-requests`; webhook → aggiorna `partner_requests` e checklist |
| 5 | **Checklist — update stato** | pianificato | `PATCH /checklist/:id`; transizioni `open` → `in_progress` → `completed` / `waived` in UI |
| 6 | **Template documenti aggiuntivi** | parziale | Solo `risk_assessment` esiste; mancano DoC, fascicolo tecnico, elementi etichetta |
| 7 | **Amazon SP-API connector** | pianificato | Dopo Shopify; oggi stub vuoto su mock-server e errore nel worker |

### Note P0

- **Classificazione:** il provider astratto esiste (`classify.ts`), ma `ollama` e `openai` lanciano eccezione — vedi [CODEMAP.md §7](./CODEMAP.md#72-flusso-skuclassify-dettaglio).
- **Partner:** endpoint webhook ingest presente; il mock-server simula RP/EPR ma non aggiorna lo stato in Varco DB.
- **Documenti:** `DOCUMENT_TEMPLATE_IDS` in `@varco/shared` contiene solo `risk_assessment`.

---

## P1 — Production readiness

| # | Item | Stato | Dettaglio |
|---|------|-------|-----------|
| 8 | **RBAC `regulatory_admin`** | pianificato | Solo ruolo regulatory può approvare regole matrice; enforcement in API |
| 9 | **Matrice — solo regole `approvata` in staging/prod** | pianificato | Dev usa `bozza`; prod filtra per `review_status` |
| 10 | **API admin matrice** | pianificato | `GET /matrix/versions`, `POST /matrix/import`, changelog regole |
| 11 | **Row Level Security cablata** | completato | `withOrgContext` / `withUserContext` in `@varco/database`; migration `0003_auth_rls_policies` |
| 12 | **Storage token marketplace cifrato** | pianificato | Token OAuth Shopify/Amazon in DB con encryption at rest |
| 13 | **Osservabilità worker** | pianificato | Bull Board, metriche job, alerting su failure |
| 14 | **Test integrazione E2E** | pianificato | catalog.sync → classify → checklist → PDF con fixture |
| 15 | **Email transazionali** | pianificato | Mailhog in Docker ma nessun flusso (reset password, notifiche) |

---

## P2 — Post-MVP

Funzionalità fuori scope v1 documentate in [ARCHITECTURE.md §14](./ARCHITECTURE.md#14-backlog-architetturale-post-mvp) e nel [README](./README.md#perimetro-mvp-v1).

| # | Feature | Impatto |
|---|---------|---------|
| 16 | **Marketplace shield** | Sync attributi verso Amazon/Etsy; diff e correzione pre-blocco listing |
| 17 | **Radar normativo 27 paesi** | Ingest normative, notifiche SKU affected, human review |
| 18 | **RAEE / batterie** | Estensione matrice + partner WEEE |
| 19 | **Workspace agenzie + API pubblica** | Multi-tenant hierarchy, API keys, rate limit |
| 20 | **Regulatory radar NLP** | Vector store su testi legali + coda revisione umana |
| 21 | **Billing Stripe** | Piani, metering SKU, fatturazione |
| 22 | **Landing marketing** | Sito pubblico separato da `apps/web` (oggi solo dashboard) |

---

## Completato (riferimento)

Spostato da backlog attivo — dettaglio in [PROGRESS.md](./PROGRESS.md).

- [x] Scaffold monorepo (pnpm + Turborepo)
- [x] Docker Compose (PG, Redis, MinIO, Mailhog, mock-server)
- [x] Package database (Drizzle, migrations, seed)
- [x] Package matrix (validate, seed, 12 regole bozza)
- [x] Mock server catalogo Shopify + partner
- [x] API NestJS skeleton + domini catalogo/SKU/checklist/documenti
- [x] Worker BullMQ (3 job types)
- [x] Classification mock → checklist
- [x] PDF risk assessment → MinIO
- [x] Web MVP dashboard (4 pagine + login)
- [x] Auth.js + JWT API + BFF proxy
- [x] CI GitHub Actions
- [x] Script `pnpm demo:populate`
- [x] Design system Replit-inspired

---

## Aree di contributo

Allineate a [CONTRIBUTING.md](./CONTRIBUTING.md#aree-di-contributo):

| Area | Focus backlog |
|------|---------------|
| Engineering | Connettori live, LLM, documenti, checklist UX, worker observability |
| Regulatory / knowledge ops | Righe matrice, review template, processo changelog norme |
| Product / design | Onboarding seller, copy disclaimer, lead magnet scanner 1 SKU |

---

## Come aggiornare questo file

1. Sposta item completati nella sezione **Completato** e aggiorna [PROGRESS.md](./PROGRESS.md).
2. Aggiungi nuovi item con priorità e link a issue GitHub se esiste.
3. Se un item cambia architettura, aggiorna anche [ARCHITECTURE.md](./ARCHITECTURE.md) e [CODEMAP.md](./CODEMAP.md).

---

## Collegamenti

- [Progress](./PROGRESS.md)
- [Code map](./CODEMAP.md)
- [Architettura](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
