# Varco — Registro attività

Traccia cosa è stato fatto sul progetto (documentazione, architettura, implementazione).  
Aggiornare questo file a fine sessione di lavoro o al merge di PR significative.

**Legenda stato:** `completato` · `in corso` · `pianificato` · `bloccato`

---

## Riepilogo

| Area | Stato | Note |
|------|-------|------|
| Product spec | completato | `06-varco-ai-eu-compliance-it.md` |
| Architettura | completato | `ARCHITECTURE.md` v1 |
| README esterno | completato | `README.md` |
| Contributing | completato | `CONTRIBUTING.md` |
| Monorepo / codice | in corso | Fasi 1–4 su `develop`; prossima: mock server / API |
| Docker Compose | completato | postgres, redis, minio, mailhog, mock-server |
| Package database | completato | Drizzle 13 tabelle, migration `0000_init`, seed demo |
| Matrice obblighi seed | completato | `matrix-v0.yaml` — 12 regole in bozza |
| Connettori catalogo | pianificato | Mock first |
| Pipeline classificazione | pianificato | Provider astratto: mock / Ollama / OpenAI |
| Generatore documenti GPSR | pianificato | Template per categoria |
| Partner broker (mock) | pianificato | RP + EPR |
| Auth + dashboard | pianificato | Post scaffold |
| Design system | completato | `design/stripe/DESIGN.md` — riferimento Stripe-inspired |

**Decisioni MVP confermate (2026-06-12):**
- Auth v1: email/password + sessione demo (`demo@varco.local`); OAuth Shopify in fase successiva
- Landing `index.html` statica in root; `apps/web` = sola dashboard prodotto
- Fixture catalogo mock: ~20 SKU sulle 5 categorie MVP

---

## Cronologia

### 2026-06-12

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Analisi product spec IT/EN | completato | Letti `06-varco-ai-eu-compliance-it.md` e versione EN |
| Definizione architettura MVP | completato | Principi, stack, domini, API, modello dati, mock locali |
| Documento `ARCHITECTURE.md` | completato | Vista sistema, mermaid, struttura repo target, env locale |
| Documento `CONTRIBUTING.md` | completato | Setup, PR, standard, regole matrice |
| Documento `WORK_LOG.md` | completato | Questo file — tracciamento iniziale |
| Decisioni stack | completato | pnpm monorepo, Next.js, NestJS API, PG, Redis, MinIO |
| Identificazione mock | completato | Shopify, Amazon, LLM, partners — DB/Redis/MinIO reali in locale |

**Non fatto (esplicitamente fuori scope di questa sessione):**
- Scaffold codice (`apps/`, `packages/`, `docker-compose.yml`)
- Seed matrice YAML
- Implementazione connettori o API
- Validazione legale disclaimers

**Decisioni architetturali confermate** (vedi `ARCHITECTURE.md` §15–17):
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
| `README.md` per esterni | completato | Prodotto, MVP, stack, setup; esclusi dati interni (pricing, GTM, unit economics) |
| Rinomina `ARCHITECTURE.md` | completato | Da `architecture.md`; aggiornati riferimenti in CONTRIBUTING e WORK_LOG |
| Avvio implementazione a fasi | in corso | Branch da `develop`, commit per fase |
| Scaffold monorepo (fase 1) | completato | pnpm, Turborepo, ESLint, Prettier, `.env.example`, apps skeleton, `@varco/shared` |
| Docker Compose (fase 2) | completato | PG 16, Redis, MinIO, Mailhog, mock-server Fastify |
| Package database (fase 3) | completato | Schema Drizzle 13 tabelle, migration `0000_init`, seed demo |

### 2026-06-12 (sessione 4)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Istruzioni install pnpm | completato | Sezione in CONTRIBUTING (corepack / brew / npx) |
| Package matrix (fase 4) | completato | Zod, engine match, CLI validate/seed, CHANGELOG |
| Matrice seed v0 | completato | 12 regole GPSR+EPR, tutte `review_status: bozza` |

### 2026-06-12 (sessione 5)

| Attività | Stato | Dettaglio |
|----------|-------|-----------|
| Design system Stripe | completato | Import `design/stripe/DESIGN.md` da awesome-design-md; `design/README.md` |
| Riferimenti design | completato | CONTRIBUTING, README, WORK_LOG aggiornati |
| Decisioni fasi 6–11 | completato | Auth email v1; landing statica; fixture ~20 SKU |

---

## Backlog prossimi passi (ordinato)

1. ~~**Scaffold monorepo**~~ — completato
2. ~~**Docker Compose**~~ — in merge *(fase 2)*
3. ~~**Package `database`**~~ — in merge *(fase 3)*
4. ~~**Package `matrix`**~~ — in merge *(fase 4)*
5. ~~**Matrice seed v0**~~ — in merge *(12 regole bozza)*
6. **Mock server** — fixture Shopify catalog + partner webhook
7. **API skeleton** — auth, org, health, OpenAPI
8. **Worker** — job `catalog.sync`, `sku.classify`, `document.generate`
9. **Classification mock** — fixture JSON → matrix match
10. **Documents** — 1 template risk assessment (toys) end-to-end
11. **Web MVP** — login, connect catalog (mock), lista SKU, checklist, download PDF
12. **CI** — GitHub Actions: lint, test, matrix validate

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
- [Design](./design/README.md)
- [Architettura](./ARCHITECTURE.md)
- [Contributing](./CONTRIBUTING.md)
- [Product spec (IT)](./06-varco-ai-eu-compliance-it.md)
