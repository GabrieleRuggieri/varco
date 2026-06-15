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

## Guida alla dashboard

Il flusso operativo in cinque schermate — dalla login alla checklist obblighi per paese.

### 1. Accesso

Accedi con le credenziali demo per entrare nella dashboard organizzazione.

![Login — accesso alla dashboard Varco](./docs/images/01-login.png)

### 2. Panoramica

La home riassume lo stato del catalogo: SKU importati, azioni aperte, obblighi critical e completati. La **pipeline compliance** mostra i quattro passi del flusso; i **mercati attivi** elencano i paesi MVP (DE, FR, IT, ES, NL).

![Panoramica — metriche, pipeline e mercati attivi](./docs/images/02-overview.png)

### 3. Sincronizza catalogo

Collega il mock Shopify (porta 4010) e importa prodotti e varianti SKU nel database Varco. Ogni sync aggiorna titoli, materiali, categorie e paesi target estratti dai tag.

![Catalogo — sync dal mock Shopify](./docs/images/03-catalogo.png)

### 4. Classifica SKU

Per ogni variante puoi avviare la **classificazione AI**: il modello estrae attributi strutturati e la **matrice obblighi** (non l'LLM) determina i requisiti. Da qui si generano anche i PDF risk assessment GPSR.

![SKU — tabella prodotti e azioni Classifica / PDF](./docs/images/04-skus.png)

### 5. Rivedi checklist

Le voci generate dalla matrice compaiono per **SKU × paese**: tipo obbligo (fascicolo tecnico, etichettatura, RP, EPR…), **gravità** (critical / high / …), stato operativo e riferimento normativo (es. GPSR Art. 9, CONAI).

![Checklist — obblighi per paese con gravità e riferimenti normativi](./docs/images/05-checklist.png)

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

Demo locale completa in pochi minuti.

### Prerequisiti

- Docker Desktop
- Node.js ≥ 20
- pnpm ≥ 9

### Setup

```bash
git clone https://github.com/GabrieleRuggieri/varco.git
cd varco
pnpm install
cp .env.example .env
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm matrix:seed
pnpm dev
```

In un secondo terminale, con `pnpm dev` attivo, popola catalogo, checklist e PDF demo:

```bash
pnpm demo:populate
```

| Servizio | URL |
|----------|-----|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Mailhog | http://localhost:8025 |
| MinIO | http://localhost:9001 |

Con `LLM_PROVIDER=mock` e `SHOPIFY_API_MODE=mock` non servono chiavi API esterne per lo sviluppo locale.

**Dashboard demo:** http://localhost:3000 — login `admin@varco.local` / `admin` (dopo `pnpm db:seed`).  
Per riempire catalogo, checklist e PDF: `pnpm demo:populate` (con `pnpm dev` attivo).

Guida completa per chi contribuisce: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Struttura del repository

```
varco/
├── apps/
│   ├── web/          # Dashboard Next.js
│   ├── api/          # Backend REST
│   └── worker/       # Job asincroni
├── packages/
│   ├── auth/         # JWT e sessioni
│   ├── database/     # Schema e migrations (Drizzle)
│   ├── matrix/       # Matrice obblighi (YAML + validazione)
│   ├── classification/ # Pipeline AI → attributi strutturati
│   ├── documents/    # Template e generazione PDF GPSR
│   ├── queue/        # BullMQ job definitions
│   └── shared/       # Utility condivise
├── mocks/
│   └── mock-server/  # API mock (Shopify, Amazon, Partner)
├── fixtures/         # Dati di test
├── docker/           # Postgres init scripts
└── docker-compose.yml
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
| [design/README.md](./design/README.md) | Sistema visivo di riferimento (Replit-inspired) |
| [design/replit/DESIGN.md](./design/replit/DESIGN.md) | Token colori, tipografia, componenti UI |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Setup sviluppo, standard di codice, processo PR |
