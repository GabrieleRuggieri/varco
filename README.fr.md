![Varco — Copilot IA de conformité pour vendre en Europe](./docs/cover.png)

# Varco

**Copilot IA de conformité pour vendre en Europe.**

Varco transforme les réglementations européennes sur les produits (GPSR, REP, étiquetage, PPWR) en une checklist opérationnelle par SKU, avec des brouillons de documents générés à partir de modèles validés — pour que les marques et les vendeurs puissent développer leurs ventes transfrontalières dans l'UE sans naviguer seuls dans des dizaines de portails et de consultants fragmentés.

> **Important :** Varco accompagne la _préparation_ de documents et de données structurées. Ce n'est pas un conseil juridique et ne certifie pas la conformité du produit. Chaque sortie inclut des mentions de non-responsabilité explicites.

---

## Problème

Depuis décembre 2024, le **GPSR** (General Product Safety Regulation) rend obligatoires, pour chaque produit mis sur le marché de l'UE, des exigences telles que la Responsible Person, le dossier technique, la déclaration de conformité, l'étiquetage conforme et les enregistrements **REP** emballages pays par pays. Le **PPWR** ajoute d'autres obligations à partir de 2026.

Les obligations sont par **pays**, par **catégorie de produit**, et évoluent dans le temps. Les alternatives actuelles — consultants coûteux, services mono-obligation ou renoncement au marché européen — ne passent pas à l'échelle pour des catalogues de dizaines ou centaines de SKU.

## À qui s'adresse Varco

Marques D2C et vendeurs sur marketplace (Shopify, Amazon, Etsy) avec des catalogues de 10 à 500 SKU qui vendent ou souhaitent vendre vers l'UE : jouets, cosmétiques, accessoires électroniques, vêtements, articles pour la maison.

## Ce que fait Varco

| Fonctionnalité                   | Description                                                                                                                                                                       |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Scan du catalogue**            | Connexion à Shopify/Amazon ; import des titres, descriptions, matériaux, images et marchés cibles                                                                                 |
| **Classification SKU**           | L'IA extrait des attributs structurés (catégorie, matériaux, âge, etc.) ; les obligations proviennent d'une **matrice validée par des experts**, pas de la sortie libre du modèle |
| **Checklist par pays**           | Obligations avec gravité, échéances et statut opérationnel — de « 27 pays de jargon juridique » à « vos N actions à mener »                                                       |
| **Générateur de documents GPSR** | Brouillons d'évaluation des risques, squelette de dossier technique, déclaration de conformité, éléments d'étiquetage — à partir de modèles par catégorie                         |
| **RP et REP via partenaires**    | Orchestration de la nomination de Responsible Person et des enregistrements auprès des éco-organismes via des partenaires intégrés (Varco coordonne, ne fournit pas le service)   |

### Périmètre MVP (v1)

- **5 catégories** × **5 pays** : jouets, textile, accessoires électroniques, cosmétique, maison × Allemagne, France, Italie, Espagne, Pays-Bas
- Connecteur catalogue (Shopify prioritaire ; Amazon en phase ultérieure)
- Matrice d'obligations versionnée avec workflow de révision réglementaire
- Fournisseur LLM abstrait : mock en CI, Ollama optionnel en développement local

Fonctionnalités prévues dans les prochaines versions : radar réglementaire sur 27 pays, bouclier marketplace (sync attributs), DEEE/piles, espace de travail pour agences. Détail dans [BACKLOG.md](./BACKLOG.md).

## Comment ça marche (en bref)

```
Catalogue → Classification IA (attributs) → Matrice d'obligations (lookup) → Checklist → Documents / Partenaires
```

**Principe architectural :** la matrice décide, l'IA n'invente pas. Le modèle classifie et rédige les textes ; la détermination réglementaire repose sur un lookup de données vérifiées.

Pour le détail technique, voir [ARCHITECTURE.md](./ARCHITECTURE.md). Pour le flux logiciel complet (API, worker, données, intégrations), voir [CODEMAP.md](./CODEMAP.md).

## Guide du tableau de bord

Le parcours opérationnel en cinq écrans — de la connexion à la checklist d'obligations par pays.

### 1. Connexion

Connectez-vous avec les identifiants de démonstration pour accéder au tableau de bord organisation.

![Connexion — accès au tableau de bord Varco](./docs/images/01-login.png)

### 2. Vue d'ensemble

L'accueil résume l'état du catalogue : SKU importés, actions ouvertes, obligations critical et terminées. La **pipeline compliance** affiche les quatre étapes du flux ; les **marchés actifs** listent les pays MVP (DE, FR, IT, ES, NL).

![Vue d'ensemble — métriques, pipeline et marchés actifs](./docs/images/02-overview.png)

### 3. Synchroniser le catalogue

Connectez le mock Shopify (port 4010) et importez produits et variantes SKU dans la base Varco. Chaque synchronisation met à jour titres, matériaux, catégories et pays cibles extraits des tags.

![Catalogue — synchronisation depuis le mock Shopify](./docs/images/03-catalogo.png)

### 4. Classifier les SKU

Pour chaque variante, lancez la **classification IA** : le modèle extrait des attributs structurés et la **matrice d'obligations** (pas le LLM) détermine les exigences. Les PDF d'évaluation des risques GPSR sont également générés depuis cet écran.

![SKU — tableau produits et actions Classifier / PDF](./docs/images/04-skus.png)

### 5. Revoir la checklist

Les entrées générées par la matrice apparaissent par **SKU × pays** : type d'obligation (dossier technique, étiquetage, RP, REP…), **gravité** (critical / high / …), statut opérationnel et référence réglementaire (ex. GPSR Art. 9, CONAI).

![Checklist — obligations par pays avec gravité et références réglementaires](./docs/images/05-checklist.png)

## Stack technique

| Composant | Technologie                                           |
| --------- | ----------------------------------------------------- |
| Monorepo  | pnpm + Turborepo                                      |
| Frontend  | Next.js 15, TypeScript                                |
| API       | NestJS                                                |
| Worker    | BullMQ + Redis                                        |
| Database  | PostgreSQL 16, Drizzle ORM                            |
| Auth      | Auth.js v5                                            |
| Storage   | MinIO (local) / S3 (production)                       |
| LLM       | Fournisseur abstrait : `mock` \| `ollama` \| `openai` |

## Démarrage rapide

Démo locale complète en quelques minutes.

### Prérequis

- Docker Desktop
- Node.js ≥ 20
- pnpm ≥ 9

### Installation

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

Dans un second terminal, avec `pnpm dev` actif, remplissez catalogue, checklist et PDF de démo :

```bash
pnpm demo:populate
```

| Service | URL                   |
| ------- | --------------------- |
| Web     | http://localhost:3000 |
| API     | http://localhost:3001 |
| Mailhog | http://localhost:8025 |
| MinIO   | http://localhost:9001 |

Avec `LLM_PROVIDER=mock` et `SHOPIFY_API_MODE=mock`, aucune clé API externe n'est nécessaire pour le développement local.

**Tableau de bord démo :** http://localhost:3000 — connexion `admin@varco.local` / `admin` (après `pnpm db:seed`).  
Pour remplir catalogue, checklist et PDF : `pnpm demo:populate` (avec `pnpm dev` actif).

Guide complet pour les contributeurs : [CONTRIBUTING.md](./CONTRIBUTING.md).

## Structure du dépôt

```
varco/
├── apps/
│   ├── web/          # Dashboard Next.js
│   ├── api/          # Backend REST
│   └── worker/       # Jobs asynchrones
├── packages/
│   ├── auth/         # JWT et sessions
│   ├── database/     # Schéma et migrations (Drizzle)
│   ├── matrix/       # Matrice d'obligations (YAML + validation)
│   ├── classification/ # Pipeline IA → attributs structurés
│   ├── documents/    # Modèles et génération PDF GPSR
│   ├── queue/        # Définitions de jobs BullMQ
│   └── shared/       # Utilitaires partagés
├── mocks/
│   └── mock-server/  # API mock (Shopify, Amazon, Partenaires)
├── fixtures/         # Données de test
├── docker/           # Scripts d'init Postgres
└── docker-compose.yml
```

## Glossaire

| Terme    | Signification                                                                                    |
| -------- | ------------------------------------------------------------------------------------------------ |
| **GPSR** | Règlement général sur la sécurité des produits (UE), en vigueur depuis décembre 2024             |
| **EPR**  | Extended Producer Responsibility — enregistrement et contributions emballages/produits, par pays |
| **PPWR** | Règlement UE sur les emballages et les déchets d'emballages                                      |
| **RP**   | Responsible Person — entité établie dans l'UE responsable de la conformité                       |
| **DoC**  | Déclaration de Conformité                                                                        |
| **SKU**  | Article individuel du catalogue                                                                  |

## Licence

Logiciel propriétaire — tous droits réservés. Ce matériel (code et documentation) est confidentiel et destiné exclusivement à l'évaluation interne du projet Varco. Aucun accord, partenariat ou engagement commercial avec des marketplaces, des partenaires de conformité (RP/EPR), des consultants réglementaires ou des tiers n'est impliqué par ce dépôt.

Conditions complètes : [LICENSE](./LICENSE).

## Documentation

| Document                                             | Contenu                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| [GUIDA.md](./GUIDA.md) · [/guida](http://localhost:3000/guida) | Guide visuelle interactive du projet (ouvrir avec `pnpm dev`) |
| [CODEMAP.md](./CODEMAP.md)                           | Flux logiciel end-to-end, API, worker, DB, intégrations        |
| [PROGRESS.md](./PROGRESS.md)                         | État d'implémentation et historique des sessions               |
| [BACKLOG.md](./BACKLOG.md)                           | Travail restant priorisé (MVP → post-MVP)                      |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                 | Architecture système, domaines, décisions, modèle de données   |
| [design/README.md](./design/README.md)               | Système visuel de référence (Replit-inspired)                  |
| [design/replit/DESIGN.md](./design/replit/DESIGN.md) | Tokens couleur, typographie, composants UI                     |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                 | Setup développement, standards de code, processus PR           |
