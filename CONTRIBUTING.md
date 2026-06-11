# Contribuire a Varco

Guida per chi sviluppa sul repository Varco — AI compliance copilot per vendere in Europa.

---

## Prima di iniziare

1. Leggi `06-varco-ai-eu-compliance-it.md` (contesto prodotto).
2. Leggi `architecture.md` (stack, domini, mock locali).
3. Controlla `WORK_LOG.md` per vedere cosa è già stato fatto e cosa è in corso.

---

## Setup locale

### Prerequisiti

- Docker Desktop
- Node.js ≥ 20
- pnpm ≥ 9
- Git

### Avvio (quando il codice sarà presente)

```bash
git clone <repo-url>
cd varco
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm matrix:seed
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001
- Mailhog: http://localhost:8025
- MinIO console: http://localhost:9001
- Mock server: http://localhost:4010

Con `LLM_PROVIDER=mock` e `SHOPIFY_API_MODE=mock` non servono chiavi API esterne.

Per testare la classificazione con un modello reale in locale, installa [Ollama](https://ollama.com) e imposta `LLM_PROVIDER=ollama` (vedi `architecture.md` §17).

---

## Struttura del progetto

Vedi `architecture.md` §4. In sintesi:

| Path | Contenuto |
|------|-----------|
| `apps/web` | Dashboard Next.js |
| `apps/api` | Backend API |
| `apps/worker` | Job asincroni |
| `packages/matrix` | Matrice obblighi (YAML + validazione) |
| `packages/connectors` | Shopify, Amazon, mock |
| `packages/classification` | Pipeline LLM → matrix |
| `packages/documents` | Template GPSR |
| `fixtures/` | Dati di test e mock |

---

## Come contribuire

### 1. Issue e scope

- Apri o commenta un issue prima di grandi cambiamenti.
- Un PR = un obiettivo chiaro (es. «connector Shopify mock», non «misc fixes»).
- Feature fuori MVP (marketplace shield, 27 paesi): discutere in issue prima del codice.

### 2. Branch

```bash
git checkout -b feat/short-description
# oppure fix/, chore/, docs/
```

### 3. Commit

- Messaggi in inglese o italiano, imperativo, concisi.
- Esempi: `Add Shopify mock connector`, `Fix checklist status enum`.

### 4. Pull request

- Descrizione: cosa, perché, come testato.
- Screenshots per UI.
- Se tocchi la **matrice obblighi**: indicare reviewer regulatory (non solo code review tech).
- Aggiorna `WORK_LOG.md` con una riga sotto la data del merge.

### 5. Checklist PR

- [ ] `pnpm lint` e `pnpm test` passano
- [ ] `pnpm matrix:validate` passa (se modificata la matrice)
- [ ] Migration DB inclusa se schema cambia
- [ ] Nessuna chiave API o secret nel diff
- [ ] Documentazione aggiornata se cambia comportamento pubblico

---

## Aree di contributo

### Engineering

- Connettori catalogo (Shopify live, Amazon mock → live)
- Pipeline classificazione e integrazione matrix
- Generatore documenti GPSR (template + PDF)
- Dashboard checklist e UX seller
- Worker, retry, osservabilità

### Regulatory / knowledge ops

- Righe matrice in `packages/matrix/data/`
- Review template documenti per categoria
- Validazione checklist seed 5 categorie × 5 paesi
- Processo di changelog quando una norma cambia

**Importante:** la matrice obblighi non viene generata da LLM. Contributi normativi = YAML curato + `regulation_ref` + note.

### Product / design

- Flussi onboarding (collega catalogo → prima checklist)
- Copy disclaimer e confini di responsabilità
- Lead magnet «scanner 1 SKU gratis»

---

## Standard di codice

- **Lingua:** italiano per UI, documentazione, commenti nel codice e messaggi di commit. I nomi di dominio in inglese sono accettati dove è convenzione consolidata (`Sku`, `ChecklistItem`, `GET /skus`).
- **TypeScript** strict dove possibile.
- **Formatting:** Prettier (config in repo quando aggiunta).
- **Lint:** ESLint.
- **API:** validazione input con Zod; errori HTTP coerenti.
- **DB:** migrations via Drizzle; no modifiche manuali su prod.
- **Test:** unit per matrix engine e classification mapping; integration per flussi critici con fixture.

### Naming

- Codici paese: `DE`, `FR`, `IT`, `ES`, `NL` (ISO 3166-1 alpha-2).
- Categorie prodotto: allineate a `packages/matrix` (es. `toys`, `apparel`).
- Env vars: `SCREAMING_SNAKE_CASE`.

---

## Matrice obblighi — regole per i contributori

1. Ogni regola ha `id` stabile (non rinominare senza migration).
2. Campi obbligatori: `countries`, `product_categories`, `obligation_type`, `severity`, `regulation_ref`, `effective_from`.
3. PR che aggiunge/modifica regole richiede:
   - Entry in `packages/matrix/CHANGELOG.md`
   - Review da persona con ruolo regulatory (anche esterna al team dev)
4. Non usare linguaggio che implichi «certificazione di conformità» nei template.

---

## Mock e test

- Preferire fixture deterministiche in `fixtures/`.
- Test LLM: `LLM_PROVIDER=mock` — niente chiamate API in CI.
- Test E2E opzionali in fase MVP; integration su catalog → classify → checklist è prioritario.

```bash
pnpm test
pnpm test:integration
pnpm matrix:validate
```

---

## Sicurezza

- Non committare `.env`, token, credenziali marketplace.
- Segnalare vulnerabilità in privato al maintainer (non issue pubbliche).
- Token OAuth: solo encrypted at rest; non loggare payload sensibili.

---

## Domande

- Architettura: `architecture.md` e issue con label `architecture`
- Prodotto/normative: issue con label `regulatory`
- Blockers setup: issue con label `dev-env`

---

## Licenza

Il codice è pubblicato in modalità **source available** con tutti i diritti riservati.
Vedi [LICENSE](./LICENSE) per i termini completi.

In sintesi:

- **Consultazione** del codice su GitHub: consentita a scopo informativo non commerciale.
- **Fork, modifica, deploy o uso** (anche personale): richiedono autorizzazione scritta del titolare.
- **Uso commerciale** (SaaS, uso aziendale con ricavi, rivendita): richiede licenza commerciale separata.

I contributi al repository sono accettati solo su invito. Con l'invio di un contributo,
il contributore concede al titolare i diritti necessari per includere e distribuire
quel contributo nel progetto, nei limiti della licenza applicabile.
