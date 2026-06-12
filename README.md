# Varco

**Copilot AI di compliance per vendere in Europa.**

Varco trasforma le normative europee sui prodotti (GPSR, EPR, etichettatura, PPWR) in una checklist operativa per SKU, con bozze di documenti generate da template revisionati — così brand e seller possono espandere la vendita cross-border nell'UE senza navigare da soli decine di portali e consulenti frammentati.

> **Importante:** Varco supporta la *preparazione* di documenti e dati strutturati. Non è consulenza legale e non certifica la conformità del prodotto. Ogni output include disclaimer espliciti.

---

## Problema

Dal dicembre 2024 il **GPSR** (General Product Safety Regulation) ha reso obbligatori, per ogni prodotto immesso sul mercato UE, requisiti come il Responsible Person, il fascicolo tecnico, la dichiarazione di conformità, l'etichettatura a norma e le registrazioni **EPR** imballaggi paese per paese. Il **PPWR** aggiunge ulteriori obblighi a partire dal 2026.

Gli obblighi sono per **paese**, per **categoria di prodotto**, e cambiano nel tempo. Le alternative attuali — consulenti costosi, servizi mono-obbligo, o rinunciare al mercato europeo — non scalano su cataloghi con decine o centinaia di SKU.

## Per chi è pensato

Brand D2C e seller su marketplace (Shopify, Amazon, Etsy) con cataloghi da 10 a 500 SKU che vendono o vogliono vendere verso l'UE: giocattoli, cosmetica, accessori elettronici, abbigliamento, articoli per la casa.

## Cosa fa

| Funzionalità | Descrizione |
|--------------|-------------|
| **Scansione catalogo** | Collegamento a Shopify/Amazon; import titoli, descrizioni, materiali, immagini e mercati target |
| **Classificazione SKU** | L'AI estrae attributi strutturati (categoria, materiali, età, ecc.); gli obblighi derivano da una **matrice curata da esperti**, non dall'output libero del modello |
| **Checklist per paese** | Obblighi con gravità, scadenze e stato operativo — da «27 paesi di legalese» a «le tue N azioni da fare» |
| **Generatore documenti GPSR** | Bozze di risk assessment, scheletro fascicolo tecnico, dichiarazione di conformità, elementi di etichetta — da template per categoria |
| **RP ed EPR via partner** | Orchestrazione di nomina Responsible Person e registrazioni ai consorzi tramite partner integrati (Varco coordina, non eroga il servizio) |

### Perimetro MVP (v1)

- **5 categorie** × **5 paesi**: giocattoli, tessile, accessori elettronici, cosmetica, casa × Germania, Francia, Italia, Spagna, Paesi Bassi
- Connettore catalogo (Shopify prioritario; Amazon in fase successiva)
- Matrice obblighi versionata con workflow di revisione normativa
- Provider LLM astratto: mock in CI, Ollama opzionale in sviluppo locale

Funzionalità pianificate in release successive: radar normativo su 27 paesi, scudo marketplace (sync attributi), RAEE/batterie, workspace per agenzie.

## Come funziona (in sintesi)

```
Catalogo → Classificazione AI (attributi) → Matrice obblighi (lookup) → Checklist → Documenti / Partner
```

**Principio architetturale:** la matrice decide, l'AI non inventa. Il modello classifica e redige testi; la determinazione normativa è lookup su dati verificati.

Per il dettaglio tecnico vedi [ARCHITECTURE.md](./ARCHITECTURE.md).

## Stack tecnologico

| Componente | Tecnologia |
|------------|------------|
| Monorepo | pnpm + Turborepo |
| Frontend | Next.js 15, TypeScript |
| API | NestJS |
| Worker | BullMQ + Redis |
| Database | PostgreSQL 16, Drizzle ORM |
| Auth | Auth.js v5 |
| Storage | MinIO (locale) / S3 (produzione) |
| LLM | Provider astratto: `mock` \| `ollama` \| `openai` |

## Avvio rapido

> Il progetto è in fase di implementazione attiva. I comandi sotto descrivono il setup target quando il codice sarà disponibile.

### Prerequisiti

- Docker Desktop
- Node.js ≥ 20
- pnpm ≥ 9

### Setup

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

| Servizio | URL |
|----------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Mailhog | http://localhost:8025 |
| MinIO | http://localhost:9001 |

Con `LLM_PROVIDER=mock` e `SHOPIFY_API_MODE=mock` non servono chiavi API esterne per lo sviluppo locale.

Guida completa per chi contribuisce: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Struttura del repository

```
varco/
├── apps/
│   ├── web/          # Dashboard Next.js
│   ├── api/          # Backend REST
│   └── worker/       # Job asincroni
├── packages/
│   ├── database/     # Schema e migrations
│   ├── matrix/       # Matrice obblighi (YAML + validazione)
│   ├── connectors/   # Shopify, Amazon, mock
│   ├── classification/
│   ├── documents/
│   ├── partners/
│   └── shared/
├── fixtures/         # Dati di test
└── docker/           # Docker Compose
```

## Glossario

| Termine | Significato |
|---------|-------------|
| **GPSR** | Regolamento generale sulla sicurezza dei prodotti (UE), in vigore dal dicembre 2024 |
| **EPR** | Extended Producer Responsibility — registrazione e contributi per imballaggi/prodotti, per paese |
| **PPWR** | Regolamento UE sugli imballaggi e sui rifiuti di imballaggio |
| **RP** | Responsible Person — soggetto stabilito nell'UE responsabile della conformità |
| **DoC** | Dichiarazione di Conformità |
| **SKU** | Singolo articolo a catalogo |

## Licenza

Il codice è pubblicato in modalità **source available** con tutti i diritti riservati. Vedi [LICENSE](./LICENSE).

- Consultazione del codice su GitHub: consentita a scopo informativo non commerciale
- Fork, modifica, deploy o uso (anche personale): richiedono autorizzazione scritta del titolare
- Uso commerciale: richiede licenza commerciale separata

I contributi al repository sono accettati solo su invito.

## Documentazione

| Documento | Contenuto |
|-----------|-----------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Architettura di sistema, domini, API, modello dati |
| [design/README.md](./design/README.md) | Sistema visivo di riferimento (Stripe-inspired) |
| [design/stripe/DESIGN.md](./design/stripe/DESIGN.md) | Token colori, tipografia, componenti UI |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Setup sviluppo, standard di codice, processo PR |
| [WORK_LOG.md](./WORK_LOG.md) | Registro attività e stato implementazione |
