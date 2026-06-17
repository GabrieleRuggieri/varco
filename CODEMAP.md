# Varco — Code map

Mappa del software: struttura del monorepo, flussi end-to-end, API, job asincroni, dati e integrazioni.  
Per lo stato di implementazione vedi [PROGRESS.md](./PROGRESS.md). Per il lavoro rimanente vedi [BACKLOG.md](./BACKLOG.md).

---

## 1. Principio guida

```
Catalogo → Classificazione AI (attributi) → Matrice obblighi (lookup) → Checklist → Documenti / Partner
```

**La matrice decide, l'AI non inventa.** L'LLM estrae attributi strutturati (categoria, materiali, età, mercati); gli obblighi derivano da righe verificate in `packages/matrix/data/`, non da output libero del modello.

---

## 2. Vista sistema

```mermaid
flowchart TB
    subgraph client [Client]
        Web["apps/web — Next.js 15"]
    end

    subgraph api [API Layer]
        BFF["/api/v1 — BFF proxy"]
        Nest["apps/api — NestJS"]
    end

    subgraph async [Async]
        Redis[(Redis / BullMQ)]
        Worker["apps/worker"]
    end

    subgraph data [Dati]
        PG[(PostgreSQL 16)]
        S3[(MinIO / S3)]
    end

    subgraph external [Esterni — mockabili]
        MockShop[mock-server Shopify]
        MockLLM[fixture LLM]
        MockPartner[mock-server RP/EPR]
    end

    Web --> BFF
    Web --> Nest
    BFF --> Nest
    Nest --> Redis
    Redis --> Worker
    Worker --> PG
    Worker --> S3
    Worker --> MockShop
    Worker --> MockLLM
    Nest --> PG
    MockPartner -.->|webhook| Nest
```

### Porte e URL (sviluppo locale)

| Servizio | URL | Ruolo |
|----------|-----|-------|
| Web | http://localhost:3000 | Dashboard seller |
| API | http://localhost:3001/api | REST + Swagger `/api/docs` |
| Mock server | http://localhost:4010 | Shopify, Amazon stub, partner |
| PostgreSQL | localhost:5432 | Dati applicativi |
| Redis | localhost:6379 | Code BullMQ |
| MinIO | http://localhost:9001 | PDF e allegati |
| Mailhog | http://localhost:8025 | Email dev (non cablata) |

---

## 3. Struttura monorepo

```
varco/
├── apps/
│   ├── web/                 # Dashboard Next.js (Auth.js, BFF, SSR)
│   ├── api/                 # REST NestJS (domini, enqueue job)
│   └── worker/              # Consumer BullMQ (sync, classify, PDF)
├── packages/
│   ├── auth/                # JWT API (sign/verify)
│   ├── database/            # Drizzle schema, migrations, seed
│   ├── matrix/              # YAML obblighi + engine matchRules
│   ├── classification/      # Pipeline LLM → attributi strutturati
│   ├── documents/           # Generazione PDF + upload S3
│   ├── queue/               # Enqueue job BullMQ
│   ├── shared/              # Costanti dominio, tipi job
│   └── tsconfig/            # Config TypeScript condivise
├── mocks/mock-server/       # Fastify: Shopify, Amazon stub, partner
├── fixtures/                # shopify-catalog.json, llm-classifications/
├── design/                  # Sistema visivo (Replit-inspired)
├── docs/images/             # Screenshot dashboard
├── docker-compose.yml       # Infra locale (non le app Node)
└── turbo.json               # Orchestrazione build/test/lint
```

### Grafo dipendenze (semplificato)

```mermaid
flowchart BT
    shared["@varco/shared"]
    database["@varco/database"]
    matrix["@varco/matrix"]
    classification["@varco/classification"]
    documents["@varco/documents"]
    queue["@varco/queue"]
    auth["@varco/auth"]

    database --> shared
    matrix --> database
    classification --> shared
    documents --> shared
    queue --> shared
    auth --> shared

    web["apps/web"] --> auth
    web --> database
    web --> shared

    api["apps/api"] --> auth
    api --> database
    api --> documents
    api --> queue
    api --> shared

    worker["apps/worker"] --> classification
    worker --> documents
    worker --> database
    worker --> matrix
    worker --> queue
    worker --> shared
```

---

## 4. Flusso compliance end-to-end

### 4.1 Sequenza operativa (demo)

```mermaid
sequenceDiagram
    actor User as Seller
    participant Web as apps/web
    participant API as apps/api
    participant Q as Redis/BullMQ
    participant W as apps/worker
    participant Mock as mock-server
    participant PG as PostgreSQL
    participant S3 as MinIO

    User->>Web: Login (admin@varco.local)
    Web->>API: GET /organizations/me (JWT)
    User->>Web: Sincronizza catalogo
    Web->>API: POST /catalog/sync
    API->>Q: job catalog.sync
    Q->>W: catalog.sync
    W->>Mock: GET prodotti Shopify
    W->>PG: upsert products, skus

    User->>Web: Classifica SKU
    Web->>API: POST /skus/:id/classify
    API->>Q: job sku.classify
    Q->>W: sku.classify
    W->>W: classifySku (mock LLM)
    W->>W: matchRules (matrix)
    W->>PG: classification_runs, checklist_items

    User->>Web: Genera PDF
    Web->>API: POST /skus/:id/documents
    API->>Q: job document.generate
    Q->>W: document.generate
    W->>W: generateDocument (pdfkit)
    W->>S3: upload PDF
    W->>PG: documents, checklist in_progress

    User->>Web: Scarica documento
    Web->>API: GET /documents/:id/download
    API->>S3: presigned URL
    API-->>User: redirect download
```

### 4.2 Script demo

```bash
docker compose up -d
pnpm db:migrate && pnpm db:seed && pnpm matrix:seed
pnpm dev                    # web + api + worker
pnpm demo:populate          # sync + classify + PDF su SKU demo
```

---

## 5. apps/web — Dashboard

### Route UI

| Route | Tipo | Descrizione |
|-------|------|-------------|
| `/login` | pubblica | Credenziali demo |
| `/` | protetta | Panoramica metriche e pipeline |
| `/catalog` | protetta | Connessioni marketplace + sync |
| `/skus` | protetta | Tabella SKU, classifica, genera PDF |
| `/checklist` | protetta | Obblighi per SKU × paese |

### Route API interne (Next.js)

| Route | Ruolo |
|-------|-------|
| `/api/auth/[...nextauth]` | Auth.js v5 — sessione JWT |
| `/api/v1/[...path]` | BFF proxy verso NestJS (GET/POST, Bearer JWT) |

### Pattern dati

- **SSR (server):** pagine dashboard chiamano NestJS direttamente via `src/lib/api.ts`
- **Mutazioni client:** `useApiPost` → `/api/v1/*` → NestJS (evita esporre token al browser)
- **Middleware:** `src/middleware.ts` reindirizza a `/login` senza sessione

---

## 6. apps/api — REST NestJS

Prefisso globale: `/api`. Documentazione OpenAPI: `/api/docs` (non in produzione).

### Endpoint implementati

| Metodo | Route | Auth | Comportamento |
|--------|-------|------|---------------|
| GET | `/health` | — | Health check |
| GET | `/organizations/me` | JWT | Contesto utente + organizzazione |
| GET | `/catalog/connections` | JWT | Connessioni marketplace |
| POST | `/catalog/sync` | JWT | Accoda `catalog.sync` |
| GET | `/skus` | JWT | Lista SKU organizzazione |
| POST | `/skus/:id/classify` | JWT | Accoda `sku.classify` |
| GET | `/skus/:id/classification` | JWT | Ultima classificazione |
| GET | `/checklist` | JWT | Voci checklist (`?skuId=` opzionale) |
| GET | `/skus/:skuId/documents` | JWT | Documenti generati |
| POST | `/skus/:skuId/documents` | JWT | Accoda `document.generate` |
| GET | `/documents/:id/download` | JWT | URL firmato MinIO |
| POST | `/internal/partner-webhook` | webhook secret | Ingest evento partner (audit) |

### Moduli NestJS

`health` · `organizations` · `catalog` · `skus` · `checklist` · `documents` · `partner` · `auth` (guard JWT globale) · `database` · `queue`

### Endpoint pianificati (non implementati)

Vedi [BACKLOG.md](./BACKLOG.md): `PATCH /checklist/:id`, `POST/GET /partner-requests`, API matrice admin, OAuth callback Shopify/Amazon.

---

## 7. apps/worker — Job BullMQ

Coda: **`varco`**. Retry: 3 tentativi, backoff esponenziale. Job ID deduplicati per entità.

| Job | Payload | Handler | Output |
|-----|---------|---------|--------|
| `catalog.sync` | `organizationId`, `connectionId?` | `catalog-sync.handler` | `products`, `skus` da mock Shopify |
| `sku.classify` | `organizationId`, `skuId` | `sku-classify.handler` | `classification_runs`, `checklist_items` |
| `document.generate` | `organizationId`, `skuId`, `templateId` | `document-generate.handler` | PDF in MinIO, riga `documents` |

### Flusso `sku.classify` (dettaglio)

```mermaid
flowchart LR
    A[Leggi SKU da PG] --> B[classifySku]
    B --> C{LLM_PROVIDER}
    C -->|mock| D[fixture by-sku-code.json]
    C -->|ollama/openai| E[non implementato]
    D --> F[matchRules matrix]
    F --> G[Salva classification_run]
    G --> H[Genera checklist_items]
```

### Flusso `catalog.sync` (dettaglio)

1. Legge `catalog_connections` per l'organizzazione
2. Se provider `shopify` + mock → `shopify-mock-client` → `MOCK_SERVER_URL`
3. Parsa tag `varco_category:`, `varco_markets:` sui prodotti
4. Upsert `products` e `skus`
5. Amazon e altri provider → errore «non ancora supportato»

---

## 8. packages — Dominio condiviso

| Package | Responsabilità chiave |
|---------|----------------------|
| `@varco/shared` | `MVP_COUNTRIES`, `MVP_PRODUCT_CATEGORIES`, nomi job, `DOCUMENT_TEMPLATE_IDS` |
| `@varco/database` | 18 tabelle Drizzle; CLI `db:migrate`, `db:seed` |
| `@varco/matrix` | `matrix-v0.yaml`, `matchRules()`, CLI `matrix:validate`, `matrix:seed` |
| `@varco/classification` | `classifySku()` — mock attivo; ollama/openai da implementare |
| `@varco/documents` | `generateDocument()` — solo template `risk_assessment` (pdfkit) |
| `@varco/queue` | `enqueueCatalogSync`, `enqueueSkuClassify`, `enqueueDocumentGenerate` |
| `@varco/auth` | `signApiAccessToken`, `verifyApiAccessToken` |

### Perimetro MVP (costanti)

- **5 paesi:** DE, FR, IT, ES, NL
- **5 categorie:** toys, apparel, electronics_accessories, cosmetics, home
- **6 tipi obbligo:** responsible_person, technical_file, declaration_of_conformity, labeling, epr_packaging, product_safety_assessment

---

## 9. Modello dati (PostgreSQL)

### Domini principali

```mermaid
erDiagram
    organizations ||--o{ organization_members : has
    organizations ||--o{ catalog_connections : has
    organizations ||--o{ products : owns
    products ||--o{ skus : has
    skus ||--o{ classification_runs : has
    skus ||--o{ checklist_items : generates
    skus ||--o{ documents : has
    matrix_versions ||--o{ obligation_rules : contains
    organizations ||--o{ partner_requests : creates
```

### Tabelle (18)

| Dominio | Tabelle |
|---------|---------|
| Tenant | `organizations`, `users`, `organization_members`, `user_credentials` |
| Auth.js | `accounts`, `sessions`, `verification_tokens` |
| Catalogo | `catalog_connections`, `products`, `skus` |
| Matrice | `matrix_versions`, `obligation_rules`, `rule_change_logs` |
| Compliance | `classification_runs`, `checklist_items`, `documents` |
| Partner | `partner_requests`, `partner_webhook_events` |

### Migration

| File | Contenuto |
|------|-----------|
| `0000_init.sql` | Schema core |
| `0001_auth.sql` | Tabelle Auth.js |
| `0002_rls.sql` | Row Level Security (policy definite, **non cablate in app**) |

---

## 10. Integrazioni esterne

| Integrazione | Stato attuale | Config env | Implementazione |
|--------------|---------------|------------|-----------------|
| Shopify | **mock** | `SHOPIFY_API_MODE=mock` | `mocks/mock-server` + worker client |
| Amazon SP-API | **stub** | `AMAZON_API_MODE=mock` | Endpoint vuoto su mock-server |
| LLM | **mock** | `LLM_PROVIDER=mock` | `fixtures/llm-classifications/` |
| LLM Ollama | pianificato | `LLM_PROVIDER=ollama` | throw in `classify.ts` |
| LLM OpenAI | pianificato | `LLM_PROVIDER=openai` | throw in `classify.ts` |
| MinIO/S3 | **reale** (locale) | `S3_*` in `.env` | `@varco/documents` via AWS SDK |
| Partner RP/EPR | **mock** | `PARTNER_API_MODE=mock` | mock-server + webhook simulato |
| Redis | **reale** (locale) | `REDIS_URL` | BullMQ |
| PostgreSQL | **reale** (locale) | `DATABASE_URL` | Drizzle |
| Mailhog | infra only | — | Nessun flusso email in app |

### mock-server (porta 4010)

| Route | Simula |
|-------|--------|
| `/shopify/oauth/*` | OAuth Shopify |
| `/shopify/admin/api/*` | Admin API prodotti |
| `/amazon/sp-api/*` | Amazon (stub vuoto) |
| `/partners/*` | Richieste RP/EPR + webhook verso Varco dopo 5s |

---

## 11. Auth e sicurezza

```mermaid
sequenceDiagram
    participant User
    participant Web as apps/web
    participant Auth as Auth.js
    participant API as apps/api

    User->>Web: POST /login (credentials)
    Web->>Auth: verifica user_credentials
    Auth-->>Web: sessione JWT
    Web->>API: Authorization Bearer (JWT firmato @varco/auth)
    API->>API: JwtAuthGuard + org context
```

- Login: credenziali in `user_credentials` (seed demo)
- API: guard JWT globale; eccezioni: `/health`, `/internal/partner-webhook`
- Webhook partner: header secret (`WEBHOOK_SECRET`)
- Rate limiting: ThrottlerModule NestJS
- RLS Postgres: migration presente, isolamento tenant oggi a livello applicativo

---

## 12. CI e comandi utili

| Comando | Effetto |
|---------|---------|
| `pnpm dev` | Avvia web + api + worker (Turbo) |
| `pnpm build` | Build tutti i package |
| `pnpm test` | Test unitari |
| `pnpm lint` | ESLint |
| `pnpm matrix:validate` | Valida YAML matrice |
| `pnpm matrix:seed` | Carica regole in DB |
| `pnpm mock:dev` | Mock server senza Docker |
| `pnpm worker:enqueue-demo-sync` | Accoda sync demo |

GitHub Actions (`.github/workflows/ci.yml`): lint, test, typecheck, matrix validate, build.

---

## Collegamenti

- [README](./README.md) — panoramica prodotto e quick start
- [ARCHITECTURE.md](./ARCHITECTURE.md) — decisioni architetturali e modello target
- [PROGRESS.md](./PROGRESS.md) — cosa è stato completato
- [BACKLOG.md](./BACKLOG.md) — cosa manca
- [CONTRIBUTING.md](./CONTRIBUTING.md) — setup sviluppatore
- [design/replit/DESIGN.md](./design/replit/DESIGN.md) — UI dashboard
