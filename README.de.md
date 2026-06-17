![Varco — KI-Compliance-Copilot für den Verkauf in Europa](./docs/cover.png)

# Varco

**KI-Compliance-Copilot für den Verkauf in Europa.**

Varco wandelt europäische Produktregulierungen (GPSR, EPR, Kennzeichnung, PPWR) in eine operative Checkliste pro SKU um — mit aus geprüften Vorlagen generierten Dokumententwürfen. So können Brands und Seller den grenzüberschreitenden Verkauf in der EU ausbauen, ohne Dutzende fragmentierter Portale und Berater allein navigieren zu müssen.

> **Wichtig:** Varco unterstützt die _Vorbereitung_ von Dokumenten und strukturierten Daten. Es ist keine Rechtsberatung und zertifiziert nicht die Produktkonformität. Jeder Output enthält ausdrückliche Haftungsausschlüsse.

---

## Problem

Seit Dezember 2024 macht die **GPSR** (General Product Safety Regulation) für jedes Produkt, das in der EU in Verkehr gebracht wird, Anforderungen wie Responsible Person, technische Dokumentation, Konformitätserklärung, konforme Kennzeichnung und **EPR**-Verpackungsregistrierungen landesspezifisch verpflichtend. Die **PPWR** fügt ab 2026 weitere Pflichten hinzu.

Die Anforderungen gelten pro **Land**, pro **Produktkategorie** und ändern sich im Laufe der Zeit. Die heutigen Alternativen — teure Berater, Einzelpflichten-Dienste oder der Verzicht auf den europäischen Markt — skalieren nicht für Kataloge mit Dutzenden oder Hunderten von SKUs.

## Für wen

D2C-Brands und Marketplace-Seller (Shopify, Amazon, Etsy) mit Katalogen von 10 bis 500 SKUs, die in der EU verkaufen oder verkaufen wollen: Spielzeug, Kosmetik, elektronische Zubehörteile, Bekleidung, Haushaltswaren.

## Was Varco leistet

| Funktion                     | Beschreibung                                                                                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Katalog-Scan**             | Anbindung an Shopify/Amazon; Import von Titeln, Beschreibungen, Materialien, Bildern und Zielmärkten                                                                       |
| **SKU-Klassifizierung**      | KI extrahiert strukturierte Attribute (Kategorie, Materialien, Alter usw.); Pflichten stammen aus einer **von Experten kuratierten Matrix**, nicht aus freiem Modelloutput |
| **Checkliste pro Land**      | Pflichten mit Schweregrad, Fristen und operativem Status — von «27 Länder Rechtstext» zu «deine N nächsten Schritte»                                                       |
| **GPSR-Dokumentengenerator** | Entwürfe für Risikobewertung, technische Dokumentation, Konformitätserklärung, Kennzeichnungselemente — aus kategoriespezifischen Vorlagen                                 |
| **RP und EPR über Partner**  | Orchestrierung der Benennung einer Responsible Person und Registrierungen bei Konsortien über integrierte Partner (Varco koordiniert, erbringt den Service nicht)          |

### MVP-Umfang (v1)

- **5 Kategorien** × **5 Länder**: Spielzeug, Textil, elektronisches Zubehör, Kosmetik, Haushalt × Deutschland, Frankreich, Italien, Spanien, Niederlande
- Katalog-Connector (Shopify priorisiert; Amazon in späterer Phase)
- Versionierte Pflichtenmatrix mit Workflow zur regulatorischen Prüfung
- Abstrahierter LLM-Provider: Mock in CI, Ollama optional in lokaler Entwicklung

Geplant für spätere Releases: Regulierungsradar für 27 Länder, Marketplace-Schutz (Attribut-Sync), WEEE/Batterien, Workspace für Agenturen. Details in [BACKLOG.md](./BACKLOG.md).

## So funktioniert es (Kurzüberblick)

```
Katalog → KI-Klassifizierung (Attribute) → Pflichtenmatrix (Lookup) → Checkliste → Dokumente / Partner
```

**Architekturprinzip:** Die Matrix entscheidet, die KI erfindet nichts. Das Modell klassifiziert und formuliert Texte; die regulatorische Bestimmung erfolgt per Lookup auf verifizierten Daten.

Technische Details: [ARCHITECTURE.md](./ARCHITECTURE.md). Vollständiger Softwarefluss (API, Worker, Daten, Integrationen): [CODEMAP.md](./CODEMAP.md).

## Dashboard-Leitfaden

Der operative Ablauf in fünf Ansichten — vom Login bis zur Pflichten-Checkliste pro Land.

### 1. Anmeldung

Mit den Demo-Zugangsdaten anmelden, um zum Organisations-Dashboard zu gelangen.

![Login — Zugang zum Varco-Dashboard](./docs/images/01-login.png)

### 2. Übersicht

Die Startseite fasst den Katalogstatus zusammen: importierte SKUs, offene Aktionen, kritische und abgeschlossene Pflichten. Die **Compliance-Pipeline** zeigt die vier Schritte des Workflows; die **aktiven Märkte** listen die MVP-Länder (DE, FR, IT, ES, NL).

![Übersicht — Metriken, Pipeline und aktive Märkte](./docs/images/02-overview.png)

### 3. Katalog synchronisieren

Mock Shopify (Port 4010) verbinden und Produkte sowie SKU-Varianten in die Varco-Datenbank importieren. Jeder Sync aktualisiert Titel, Materialien, Kategorien und aus Tags extrahierte Zielländer.

![Katalog — Sync vom Mock Shopify](./docs/images/03-catalogo.png)

### 4. SKUs klassifizieren

Pro Variante kann die **KI-Klassifizierung** gestartet werden: Das Modell extrahiert strukturierte Attribute, die **Pflichtenmatrix** (nicht das LLM) bestimmt die Anforderungen. Von hier aus werden auch GPSR-Risikobewertungs-PDFs erzeugt.

![SKU — Produkttabelle mit Aktionen Klassifizieren / PDF](./docs/images/04-skus.png)

### 5. Checkliste prüfen

Aus der Matrix erzeugte Einträge erscheinen pro **SKU × Land**: Pflichttyp (technische Dokumentation, Kennzeichnung, RP, EPR …), **Schweregrad** (critical / high / …), operativer Status und Rechtsreferenz (z. B. GPSR Art. 9, CONAI).

![Checkliste — Pflichten pro Land mit Schweregrad und Rechtsreferenzen](./docs/images/05-checklist.png)

## Technologie-Stack

| Komponente | Technologie                                            |
| ---------- | ------------------------------------------------------ |
| Monorepo   | pnpm + Turborepo                                       |
| Frontend   | Next.js 15, TypeScript                                 |
| API        | NestJS                                                 |
| Worker     | BullMQ + Redis                                         |
| Database   | PostgreSQL 16, Drizzle ORM                             |
| Auth       | Auth.js v5                                             |
| Storage    | MinIO (lokal) / S3 (Produktion)                        |
| LLM        | Abstrahierter Provider: `mock` \| `ollama` \| `openai` |

## Schnellstart

Vollständige lokale Demo in wenigen Minuten.

### Voraussetzungen

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

In einem zweiten Terminal, während `pnpm dev` läuft, Katalog, Checkliste und Demo-PDFs befüllen:

```bash
pnpm demo:populate
```

| Dienst  | URL                   |
| ------- | --------------------- |
| Web     | http://localhost:3000 |
| API     | http://localhost:3001 |
| Mailhog | http://localhost:8025 |
| MinIO   | http://localhost:9001 |

Mit `LLM_PROVIDER=mock` und `SHOPIFY_API_MODE=mock` sind für die lokale Entwicklung keine externen API-Schlüssel nötig.

**Demo-Dashboard:** http://localhost:3000 — Login `admin@varco.local` / `admin` (nach `pnpm db:seed`).  
Zum Befüllen von Katalog, Checkliste und PDFs: `pnpm demo:populate` (mit laufendem `pnpm dev`).

Vollständige Anleitung für Mitwirkende: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Repository-Struktur

```
varco/
├── apps/
│   ├── web/          # Next.js Dashboard
│   ├── api/          # REST Backend
│   └── worker/       # Asynchrone Jobs
├── packages/
│   ├── auth/         # JWT und Sessions
│   ├── database/     # Schema und Migrations (Drizzle)
│   ├── matrix/       # Pflichtenmatrix (YAML + Validierung)
│   ├── classification/ # KI-Pipeline → strukturierte Attribute
│   ├── documents/    # Vorlagen und GPSR-PDF-Generierung
│   ├── queue/        # BullMQ Job-Definitionen
│   └── shared/       # Gemeinsame Utilities
├── mocks/
│   └── mock-server/  # Mock-API (Shopify, Amazon, Partner)
├── fixtures/         # Testdaten
├── docker/           # Postgres Init-Skripte
└── docker-compose.yml
```

## Glossar

| Begriff  | Bedeutung                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------- |
| **GPSR** | EU-Verordnung über die allgemeine Produktsicherheit, in Kraft seit Dezember 2024                  |
| **EPR**  | Extended Producer Responsibility — Registrierung und Beiträge für Verpackungen/Produkte, pro Land |
| **PPWR** | EU-Verordnung über Verpackungen und Verpackungsabfälle                                            |
| **RP**   | Responsible Person — in der EU niedergelassene verantwortliche Stelle für die Konformität         |
| **DoC**  | Konformitätserklärung (Declaration of Conformity)                                                 |
| **SKU**  | Einzelner Katalogartikel                                                                          |

## Lizenz

Der Code wird als **source available** mit allen Rechten vorbehalten veröffentlicht. Siehe [LICENSE](./LICENSE).

- Code-Einsicht auf GitHub: zu nicht-kommerziellen Informationszwecken erlaubt
- Fork, Änderung, Deployment oder Nutzung (auch privat): schriftliche Genehmigung des Rechteinhabers erforderlich
- Kommerzielle Nutzung: separate kommerzielle Lizenz erforderlich

Beiträge zum Repository werden nur auf Einladung angenommen.

## Dokumentation

| Dokument                                             | Inhalt                                                         |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| [CODEMAP.md](./CODEMAP.md)                           | End-to-End-Softwarefluss, API, Worker, DB, Integrationen       |
| [PROGRESS.md](./PROGRESS.md)                         | Implementierungsstand und Sitzungschronik                        |
| [BACKLOG.md](./BACKLOG.md)                           | Priorisierte offene Arbeit (MVP → Post-MVP)                      |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                 | Systemarchitektur, Domänen, Entscheidungen, Datenmodell        |
| [design/README.md](./design/README.md)               | Visuelles Referenzsystem (Replit-inspired)                     |
| [design/replit/DESIGN.md](./design/replit/DESIGN.md) | Farb-Tokens, Typografie, UI-Komponenten                          |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                 | Entwicklungs-Setup, Code-Standards, PR-Prozess                   |
