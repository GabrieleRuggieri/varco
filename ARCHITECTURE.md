# Varco — Architettura del sistema

Documento di riferimento per l'implementazione del MVP descritto in `06-varco-ai-eu-compliance-it.md`.  
Obiettivo: stack eseguibile **in locale** con mock per servizi esterni non essenziali al core.

---

## 1. Principi architetturali

| Principio | Implicazione |
|-----------|--------------|
| **La matrice decide, l'AI non inventa** | Ogni obbligo sulla checklist deriva da righe verificate nella matrice obblighi. L'LLM classifica attributi del prodotto e redige testi; la determinazione normativa è lookup su dati curati. |
| **Preparazione documenti, non consulenza legale** | Output sempre da template revisionati + disclaimer; nessun endpoint che afferma «sei a norma». |
| **Broker, non build** | RP ed EPR passano tramite partner; Varco orchestra richieste e stato, non eroga il servizio. |
| **Local-first** | `docker compose up` avvia DB, API, web, worker e mock server. LLM e marketplace opzionali via env. |
| **Audit trail 10 anni** | Documenti e versioni di classificazione immutabili (soft-delete + versioning). |

---

## 2. Vista ad alto livello

```mermaid
flowchart TB
    subgraph client [Client]
        Web[Web App - Next.js]
    end

    subgraph api [API Layer]
        Gateway[API Gateway / BFF]
    end

    subgraph core [Core Domain]
        Catalog[Catalog Service]
        Matrix[Obligation Matrix]
        Classify[Classification Pipeline]
        Checklist[Checklist Service]
        Docs[Document Generator]
        Partners[Partner Broker]
    end

    subgraph workers [Async Workers]
        ImportJob[Catalog Import]
        ClassifyJob[SKU Classification]
        GenDocJob[Document Generation]
    end

    subgraph external [External - mockable]
        Shopify[Shopify API]
        Amazon[Amazon SP-API]
        LLM[OpenAI / Anthropic]
        RPPartner[RP Partner API]
        EPRPartner[EPR Partner API]
    end

    subgraph data [Data]
        PG[(PostgreSQL)]
        S3[(Object Storage)]
        Redis[(Redis)]
    end

    Web --> Gateway
    Gateway --> Catalog
    Gateway --> Checklist
    Gateway --> Docs
    Gateway --> Partners
    Gateway --> Matrix

    Catalog --> ImportJob
    ImportJob --> Shopify
    ImportJob --> Amazon
    Classify --> ClassifyJob
    ClassifyJob --> LLM
    ClassifyJob --> Matrix
    Docs --> GenDocJob
    Partners --> RPPartner
    Partners --> EPRPartner

    ImportJob --> Redis
    ClassifyJob --> Redis
    GenDocJob --> Redis

    Catalog --> PG
    Matrix --> PG
    Checklist --> PG
    Docs --> S3
    Partners --> PG
```

---

## 3. Stack tecnologico (proposta)

| Layer | Scelta | Motivo |
|-------|--------|--------|
| Monorepo | **pnpm + Turborepo** | Web, API, worker, packages condivisi |
| Frontend | **Next.js 15 (App Router) + TypeScript** | Dashboard, auth, SSR; team piccolo |
| API | **NestJS** (o Fastify) in `apps/api` | Moduli per dominio, validazione, OpenAPI |
| Worker | **BullMQ + Redis** in `apps/worker` | Job catalogo, classificazione, PDF |
| Database | **PostgreSQL 16** | Relazioni SKU ↔ obblighi ↔ documenti |
| ORM | **Drizzle** | Type-safe, migrations leggere |
| Auth | **Auth.js (NextAuth v5)** | OAuth Shopify + credenziali email; nessuna dipendenza da Supabase Auth |
| Object storage | **MinIO** (locale) / S3 (prod) | PDF fascicoli, immagini catalogo |
| LLM | **Provider astratto** (`mock` \| `ollama` \| `openai`) | Mock in CI; Ollama in dev; OpenAI in staging/prod |
| PDF / DOCX | **Puppeteer** (HTML→PDF) + template Handlebars | Template per categoria |
| Infra locale | **Docker Compose** | PG, Redis, MinIO, Mailhog, mock server |

**Alternativa semplificata (fase 0):** un solo `apps/web` Next.js con API routes + worker in-process. Utile per prototipo rapido; la struttura sotto assume split esplicito per scalare il team.

---

## 4. Struttura del repository (target)

```
varco/
├── apps/
│   ├── web/                 # Next.js dashboard
│   ├── api/                 # REST/GraphQL BFF
│   └── worker/              # Background jobs
├── packages/
│   ├── database/            # Schema Drizzle, migrations
│   ├── matrix/              # Matrice obblighi (YAML/JSON + validazione)
│   ├── connectors/          # Shopify, Amazon, mock
│   ├── classification/      # Prompt, parser, mapping matrix
│   ├── documents/           # Template GPSR, generator
│   ├── partners/            # Adapter RP/EPR
│   └── shared/              # Tipi, costanti, utils
├── design/                  # Riferimento visivo (stripe/DESIGN.md)
├── fixtures/                # Cataloghi mock, risposte LLM, matrix seed
├── mocks/
│   └── mock-server/         # Prism o Express: Shopify, Amazon, partners
├── docker/
│   └── docker-compose.yml
├── ARCHITECTURE.md
├── CONTRIBUTING.md
└── WORK_LOG.md
```

---

## 5. Domini e responsabilità

### 5.1 Catalog Service

**Responsabilità:** connessione marketplace, sync SKU, normalizzazione.

| Entità | Campi chiave |
|--------|--------------|
| `Organization` | nome, piano, paesi target default |
| `CatalogConnection` | provider (`shopify` \| `amazon`), credentials ref, last_sync |
| `Product` | org_id, external_id, title, description, materials[], images[], category_hint |
| `Sku` | product_id, sku_code, variant_attrs, target_countries[] |

**Flusso import:**
1. OAuth o API key → salva token (encrypted).
2. Job `catalog.sync` scarica prodotti/varianti.
3. Normalizzatore mappa a schema interno (materiali da metafields/tags se presenti).
4. Upsert su `Product` / `Sku`; evento `sku.created` / `sku.updated`.

**Mock locale:** connector `fixtures/shopify-catalog.json` + mock server che replica REST Shopify Admin API.

### 5.2 Obligation Matrix (core moat)

**Responsabilità:** fonte di verità per obblighi; **non** generata da LLM.

Formato consigliato: YAML versionato in `packages/matrix/data/` con schema Zod.

```yaml
# Esempio concettuale
version: "2026-06-01"
rules:
  - id: gpsr_rp_required
    countries: [DE, FR, IT, ES, NL]
    product_categories: [toys, electronics_accessories, cosmetics, apparel, home]
    obligation_type: responsible_person
    severity: critical
    regulation_ref: "GPSR Art. 16"
    deadline_type: before_market_placement
    checklist_template_id: rp_appointment
    document_templates: []
    effective_from: "2024-12-13"
    notes: "RP UE obbligatorio per prodotti non alimentari"
```

| Entità DB | Ruolo |
|-----------|--------|
| `matrix_version` | snapshot deployato (hash del bundle YAML) |
| `obligation_rule` | regola materializzata per query veloci |
| `rule_change_log` | audit quando analisti aggiornano la matrice |

**Deploy matrice:** CLI `pnpm matrix:validate && pnpm matrix:seed` → import in PG senza downtime (nuova versione, checklist esistenti legate alla versione al momento della classificazione).

### 5.3 Classification Pipeline

**Responsabilità:** estrarre attributi strutturati dal SKU e applicare la matrice.

```mermaid
sequenceDiagram
    participant W as Worker
    participant L as LLM
    participant M as Matrix Engine
    participant DB as PostgreSQL

    W->>DB: Load SKU + matrix_version
    W->>L: classify(sku, schema)
    L-->>W: StructuredClassification
    Note over W: category, materials, age_group, has_battery, etc.
    W->>M: match_rules(classification, target_countries)
    M-->>W: matched_rule_ids[]
    W->>DB: Save ClassificationRun (immutable)
    W->>DB: Upsert ChecklistItems from rules
```

**Structured output LLM (esempio):**
```json
{
  "product_category": "toys",
  "confidence": 0.92,
  "materials": ["plastic", "paint"],
  "target_age_min": 3,
  "is_cosmetic": false,
  "requires_battery": false,
  "evidence_snippets": ["..."]
}
```

**Regole:**
- Se `confidence < 0.7` → stato checklist `needs_review` (non auto-completa).
- LLM **non** restituisce lista obblighi; solo attributi.
- Prompt + schema versionati in `packages/classification/`.

**Mock locale:** `fixtures/llm-classifications/*.json` selezionati per SKU id; env `LLM_PROVIDER=mock`.

### 5.4 Checklist Service

**Responsabilità:** vista operativa per il seller: obblighi, gravità, scadenze, stato.

| Stato | Significato |
|-------|-------------|
| `open` | Azione richiesta |
| `in_progress` | Documento o registrazione in corso |
| `blocked` | Dipende da input esterno (es. doc fornitore) |
| `completed` | Evidenza caricata o partner confermato |
| `waived` | Non applicabile (con motivo audit) |
| `needs_review` | Classificazione incerta |

**Aggregazioni API:**
- Per SKU × paese
- Per organizzazione × paese (dashboard «14 azioni»)
- Filtro per severity (`critical`, `high`, `medium`)

**Scadenze:** calcolate da `deadline_type` + date placement o regole EPR annuali (fase 2).

### 5.5 Document Generator (GPSR v1)

**Responsabilità:** bozze da template umani per categoria.

| Template v1 | Output |
|-------------|--------|
| `risk_assessment` | PDF/HTML risk assessment |
| `technical_file_skeleton` | PDF struttura fascicolo |
| `declaration_of_conformity` | PDF DoC |
| `label_elements` | PDF/PNG elementi etichetta (warning, RP, Triman placeholder) |

**Flusso:**
1. User richiede generazione per `sku_id` + `template_id`.
2. Job compila Handlebars con: dati SKU, classificazione, org, RP partner (se nominato).
3. HTML → PDF via Puppeteer; salva in MinIO con `document_version`.
4. Stato checklist collegato aggiornato a `in_progress` o `completed` se upload manuale richiesto.

**Mock:** template con watermark «DRAFT — NOT LEGAL ADVICE».

### 5.6 Partner Broker (RP + EPR)

**Responsabilità:** orchestrazione richieste a partner esterni; Varco non è RP.

| Entità | Campi |
|--------|--------|
| `partner_request` | type (`rp` \| `epr_packaging`), country, sku_id?, status, external_ref |
| `partner_webhook_event` | payload raw per audit |

**Stati:** `draft` → `submitted` → `processing` → `active` → `rejected`.

**Mock locale:** mock server restituisce `active` dopo 5s; webhook simulato su `POST /api/internal/partner-webhook`.

---

## 6. API surface (MVP)

REST con OpenAPI; autenticazione JWT/session.

| Area | Endpoint (indicativo) |
|------|------------------------|
| Auth | `POST /auth/login`, OAuth callbacks Shopify/Amazon |
| Catalog | `POST /connections`, `POST /connections/:id/sync`, `GET /skus` |
| Classification | `POST /skus/:id/classify`, `GET /skus/:id/classification` |
| Checklist | `GET /checklist`, `PATCH /checklist/:id` |
| Documents | `POST /skus/:id/documents`, `GET /documents/:id/download` |
| Partners | `POST /partner-requests`, `GET /partner-requests/:id` |
| Matrix (admin) | `GET /matrix/versions`, `POST /matrix/import` (solo regulatory lead) |

---

## 7. Modello dati (essenziale)

```mermaid
erDiagram
    Organization ||--o{ CatalogConnection : has
    Organization ||--o{ Product : owns
    Product ||--o{ Sku : has
    Sku ||--o{ ClassificationRun : classified_by
    ClassificationRun }o--|| MatrixVersion : uses
    Sku ||--o{ ChecklistItem : generates
    ChecklistItem }o--|| ObligationRule : from
    Sku ||--o{ Document : has
    Organization ||--o{ PartnerRequest : requests
    ChecklistItem ||--o| Document : evidence
```

**Indici critici:** `(org_id, status)` su checklist; `(sku_id, country)` unique su checklist item per rule; GIN su `materials` se JSONB.

---

## 8. Copertura MVP: 5 categorie × 5 paesi

| Categoria | Codice matrix |
|-----------|---------------|
| Giocattoli | `toys` |
| Tessile / abbigliamento | `apparel` |
| Accessori elettronici | `electronics_accessories` |
| Cosmetica | `cosmetics` |
| Casa | `home` |

| Paese | Codice |
|-------|--------|
| Germania | `DE` |
| Francia | `FR` |
| Italia | `IT` |
| Spagna | `ES` |
| Paesi Bassi | `NL` |

**Obbligo types v1 (non esaustivo):** `responsible_person`, `technical_file`, `declaration_of_conformity`, `labeling`, `epr_packaging`, `product_safety_assessment`.

RAEE/batterie, 27 paesi, sync marketplace: **fuori scope v1** (vedi backlog).

---

## 9. Esecuzione locale

### 9.1 Prerequisiti

- Docker Desktop
- Node.js 20+
- pnpm 9+
- (Opzionale) chiave OpenAI per classificazione reale

### 9.2 Servizi Docker Compose

| Servizio | Porta | Ruolo |
|----------|-------|-------|
| `postgres` | 5432 | DB principale |
| `redis` | 6379 | Queue BullMQ |
| `minio` | 9000 / 9001 | Storage documenti |
| `mailhog` | 8025 | Email dev |
| `mock-server` | 4010 | Shopify, Amazon, partners finti |
| `api` | 3001 | Backend |
| `worker` | — | Jobs |
| `web` | 3000 | Frontend |

### 9.3 Variabili d'ambiente (`.env.example`)

```bash
# Database
DATABASE_URL=postgresql://varco:varco@localhost:5432/varco

# Redis
REDIS_URL=redis://localhost:6379

# Storage
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=varco-documents
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# LLM — mock in CI; ollama in dev; openai in staging/prod
LLM_PROVIDER=mock          # mock | ollama | openai
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1:8b   # o mistral, qwen2.5 — structured output
OPENAI_API_KEY=            # se LLM_PROVIDER=openai

# Connectors — usa "mock" per sviluppo
SHOPIFY_API_MODE=mock      # mock | live
AMAZON_API_MODE=mock

# Partners
PARTNER_API_MODE=mock

# Auth
AUTH_SECRET=dev-secret-change-in-prod
```

### 9.4 Comandi target

```bash
pnpm install
docker compose up -d          # infra + mocks
pnpm db:migrate
pnpm db:seed                  # org demo + fixtures catalogo
pnpm matrix:seed              # matrice 5×5 seed
pnpm dev                      # web + api + worker in parallelo
```

**Demo flow locale:**
1. Login con account seed `demo@varco.local`.
2. «Collega Shopify» → mock restituisce 20 SKU da fixture.
3. Sync catalogo → worker importa SKU.
4. «Analizza catalogo» → classificazione mock → checklist popolata.
5. Genera risk assessment PDF → scarica da MinIO.
6. «Richiedi RP» → partner mock → checklist aggiornata.

---

## 10. Cosa mockare (e cosa no)

| Componente | Mock in locale? | Note |
|------------|-----------------|------|
| PostgreSQL | No — usa container reale | Serve per query checklist/matrix |
| Redis / BullMQ | No — usa container reale | Testare retry e concorrenza job |
| MinIO | No — usa container reale | PDF reali |
| Shopify API | **Sì** | OAuth simulato; fixture catalogo |
| Amazon SP-API | **Sì** | Complesso (LWA, sandbox limitata); mock obbligatorio in v1 dev |
| LLM | **Sì** (default in CI) | Fixture JSON deterministiche; **Ollama** opzionale in dev per test reali |
| RP / EPR partner | **Sì** | Stati e webhook simulati |
| Email | **Sì** | Mailhog |
| Stripe (futuro) | **Sì** | Non MVP core |

**Non mockare:** matrice obblighi, pipeline classificazione→matrix, versioning documenti, audit log.

---

## 11. Sicurezza e compliance del prodotto

- Token marketplace encrypted at rest (AES-256 o vault).
- RBAC: `owner`, `member`, `regulatory_admin` (solo matrix).
- Tutti i PDF con footer disclaimer + versione template.
- `ClassificationRun` e `Document` immutabili; nuove versioni = nuovi record.
- Log strutturati per audit (chi ha approvato `waived`, chi ha importato matrix).
- EU data residency: PG e storage in region EU in produzione (locale indifferente).

---

## 12. Osservabilità

| Livello | Tool |
|---------|------|
| Logs | Pino → stdout; aggregazione in prod (Datadog/Loki) |
| Metrics | Prometheus endpoint su API/worker |
| Tracing | OpenTelemetry (opzionale fase 1) |
| Job monitoring | Bull Board su `/admin/queues` (dev only) |

**KPI tecnici MVP:** tempo p95 classificazione SKU, tempo generazione PDF, tasso job failed, lag sync catalogo.

---

## 13. Deployment (post-locale)

| Ambiente | Target |
|----------|--------|
| Staging | Fly.io / Railway / AWS ECS — singola region EU |
| Produzione | EU-West (es. `eu-central-1`) — PG RDS, S3, Redis |
| CI | GitHub Actions: lint, test, matrix validate, migrate staging |

Non necessario per «girare in locale»; documentato per continuità.

---

## 14. Backlog architetturale (post-MVP)

| Feature | Impatto architetturale |
|---------|------------------------|
| Marketplace shield | Nuovo servizio `marketplace-sync`, webhook Amazon/Etsy, diff attributi |
| Radar 27 paesi | Pipeline ingest normative + notifiche per SKU affected |
| RAEE / batterie | Estensione matrix + partner WEEE |
| API pubblica + workspace agenzie | Multi-tenant hierarchy, API keys, rate limit |
| Regulatory radar NLP | Vector store su testi legali + human review queue |

---

## 15. Decisioni architetturali (confermate)

| # | Decisione | Scelta | Motivazione |
|---|-----------|--------|-------------|
| 1 | Layer API | **NestJS** in `apps/api` separato da Next.js | Domini distinti (catalogo, matrix, checklist, documenti, partner), OpenAPI, guard/test per modulo, worker che chiama API interne senza accoppiare al frontend |
| 2 | Auth | **Auth.js v5** | Allineato alla preferenza team; sessioni JWT/cookie su Next.js, adapter Drizzle su PG già in stack; niente vendor lock-in Supabase |
| 3 | Primo connector live | **Shopify** poi Amazon | OAuth e Admin API più semplici; Amazon SP-API resta mock fino a fase 2 |
| 4 | Lingua | **Italiano** | UI, codice (nomi dominio possono restare inglesi dove è convenzione), commenti, documentazione e commit in italiano |
| 5 | Validazione normativa | **Workflow matrice con ruolo `regulatory_admin`** | Vedi §15.1 |
| 6 | Auth v1 (MVP) | **Email/password + sessione**; OAuth Shopify dopo | Velocità: demo `demo@varco.local`; Shopify OAuth in fase connettore live |
| 7 | Landing vs app | **`index.html` statica in root**; `apps/web` = dashboard | Marketing separato dal prodotto Next.js; meno accoppiamento in fase MVP |
| 8 | Fixture catalogo mock | **~20 SKU**, 5 categorie MVP | Copre toys, apparel, electronics_accessories, cosmetics, home per demo locale |

### 15.1 Regulatory lead — cos’è e come lo gestiamo

Il **regulatory lead** non è un componente software: è il ruolo umano che garantisce che la matrice obblighi e i template documenti siano corretti prima che un seller si fidi dell’output.

**Perché è critico:** se la matrice dice «non serve RP» quando serve, il rischio è legale e reputazionale — più grave di un bug UI.

**Decisione per il MVP (pragmatica):**

1. **In sviluppo (ora):** matrice seed in stato `bozza` con disclaimer visibile in app; nessuna affermazione di conformità.
2. **Nel software:** ogni regola ha `review_status` (`bozza` \| `revisionata` \| `approvata`), `reviewed_by`, `reviewed_at`; solo regole `approvata` alimentano checklist in ambienti oltre `development`.
3. **RBAC:** ruolo `regulatory_admin` — unico che può portare regole da `bozza` → `approvata`; i developer non auto-approvano le proprie PR sulla matrice.
4. **Prima del lancio pubblico:** review esterna obbligatoria (consulente compliance prodotto UE, anche part-time/esterno) su almeno DE+FR per le 5 categorie; criterio go/no-go già nel product spec.
5. **Fino all’assunzione del lead:** il fondatore o un consulente esterno ricopre il ruolo operativo; il codice impone il processo, non sostituisce la persona.

Questo separa **velocità di sviluppo** (si lavora su matrice bozza) da **sicurezza in produzione** (solo regole approvate).

---

## 16. Monorepo: pnpm + Turborepo

### Cosa sono

- **pnpm workspaces:** un solo repository con più pacchetti (`apps/*`, `packages/*`). Le dipendenze sono installate una volta in uno store condiviso e linkate — meno disco, install più veloci, niente «ho aggiornato il package ma l’app non lo vede».
- **Turborepo:** orchestratore di task (`build`, `test`, `lint`, `dev`) che capisce il grafo delle dipendenze tra pacchetti e **cachea** gli output. Se `packages/matrix` non cambia, non rilancia i test delle app che dipendono da esso.

### Perché per Varco

| Beneficio | Esempio concreto |
|-----------|------------------|
| Tipi condivisi | `packages/shared` — `Sku`, `ChecklistItem` usati da web, api e worker |
| Matrice versionata | `packages/matrix` — YAML + validazione Zod; stesso bundle in worker e API |
| Un comando | `pnpm dev` avvia web + api + worker in parallelo |
| CI veloce | Turbo cache su GitHub Actions per `matrix:validate` e test |
| Confini chiari | Il worker non importa componenti React; solo package di dominio |

### Struttura tipica `pnpm-workspace.yaml`

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### Flusso quotidiano

```bash
pnpm install          # tutto il monorepo
pnpm dev              # turbo run dev --parallel
pnpm --filter @varco/api test   # solo API
pnpm matrix:validate  # solo package matrix
```

---

## 17. Strategia LLM: mock, Ollama o cloud?

### Tre provider, un’interfaccia

`packages/classification` espone un adapter unico:

| Provider | Quando usarlo | Pro |
|----------|---------------|-----|
| `mock` | CI, test unitari, demo senza GPU | Deterministico, zero costo, veloce |
| `ollama` | Sviluppo locale, tuning prompt | Nessuna API key, dati restano in macchina, feedback reale sul prompt |
| `openai` | Staging, produzione, benchmark qualità | Miglior structured output oggi; costo basso per SKU |

### Ollama ha senso? Sì, ma non come unico default

**Usa Ollama in dev** quando vuoi:
- iterare su prompt e schema JSON senza spendere
- non inviare titoli/descrizioni prodotto reali a terzi
- testare latenza e flusso end-to-end «vero»

**Resta il mock** per:
- CI (GitHub Actions senza GPU)
- test automatici che devono passare sempre uguali
- onboarding rapido («clone e funziona» senza installare Ollama)

**Config consigliata:**

```bash
# .env sviluppo — scegli uno
LLM_PROVIDER=mock
# LLM_PROVIDER=ollama
# LLM_PROVIDER=openai
```

Modelli Ollama adatti a structured output (JSON): `llama3.1:8b`, `mistral`, `qwen2.5:7b`. Richiedono prompt rigido + validazione Zod sul output; se il parse fallisce → retry o `needs_review`.

### Cosa non cambia con Ollama

La regola architetturale resta: **l’LLM non decide gli obblighi**. Classifica attributi (`product_category`, `materials`, …); la matrice fa il match. Ollama vs GPT-4 non cambia questo confine — cambia solo la qualità della classificazione.

### Docker Compose (opzionale)

Ollama di solito gira **sull’host** (GPU/macOS), non nel container. Il worker/API puntano a `host.docker.internal:11434`. Aggiungere un servizio `ollama` in Compose ha senso solo su Linux con GPU in team.

---

## 18. Riferimenti

- Product spec: `06-varco-ai-eu-compliance-it.md`
- Activity log: `WORK_LOG.md`
- Contributing: `CONTRIBUTING.md`
