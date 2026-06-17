![Varco — Copiloto de IA de cumplimiento para vender en Europa](./docs/cover.png)

# Varco

**Copiloto de IA de cumplimiento para vender en Europa.**

Varco convierte la normativa europea de productos (GPSR, RAP, etiquetado, PPWR) en una checklist operativa por SKU, con borradores de documentos generados a partir de plantillas revisadas — para que marcas y vendedores puedan ampliar la venta transfronteriza en la UE sin navegar solos decenas de portales y consultores fragmentados.

> **Importante:** Varco apoya la _preparación_ de documentos y datos estructurados. No es asesoramiento legal y no certifica la conformidad del producto. Cada salida incluye descargos de responsabilidad explícitos.

---

## Problema

Desde diciembre de 2024, el **GPSR** (General Product Safety Regulation) exige, para cada producto comercializado en la UE, requisitos como la Responsible Person, el expediente técnico, la declaración de conformidad, el etiquetado conforme y los registros **RAP** de envases país por país. El **PPWR** añade más obligaciones a partir de 2026.

Las obligaciones son por **país**, por **categoría de producto**, y cambian con el tiempo. Las alternativas actuales — consultores costosos, servicios de una sola obligación o renunciar al mercado europeo — no escalan en catálogos con decenas o cientos de SKU.

## Para quién

Marcas D2C y vendedores en marketplaces (Shopify, Amazon, Etsy) con catálogos de 10 a 500 SKU que venden o quieren vender en la UE: juguetes, cosmética, accesorios electrónicos, ropa, artículos para el hogar.

## Qué hace Varco

| Funcionalidad                    | Descripción                                                                                                                                                                  |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Escaneo de catálogo**          | Conexión a Shopify/Amazon; importación de títulos, descripciones, materiales, imágenes y mercados objetivo                                                                   |
| **Clasificación SKU**            | La IA extrae atributos estructurados (categoría, materiales, edad, etc.); las obligaciones provienen de una **matriz curada por expertos**, no de la salida libre del modelo |
| **Checklist por país**           | Obligaciones con gravedad, plazos y estado operativo — de «27 países de legalés» a «tus N acciones pendientes»                                                               |
| **Generador de documentos GPSR** | Borradores de evaluación de riesgos, esqueleto de expediente técnico, declaración de conformidad, elementos de etiquetado — desde plantillas por categoría                   |
| **RP y RAP vía partners**        | Orquestación de la designación de Responsible Person y registros en consorcios mediante partners integrados (Varco coordina, no presta el servicio)                          |

### Alcance MVP (v1)

- **5 categorías** × **5 países**: juguetes, textil, accesorios electrónicos, cosmética, hogar × Alemania, Francia, Italia, España, Países Bajos
- Conector de catálogo (Shopify prioritario; Amazon en fase posterior)
- Matriz de obligaciones versionada con flujo de revisión normativa
- Proveedor LLM abstracto: mock en CI, Ollama opcional en desarrollo local

Funcionalidades previstas en versiones posteriores: radar normativo en 27 países, escudo marketplace (sync de atributos), RAEE/pilas, workspace para agencias. Detalle en [BACKLOG.md](./BACKLOG.md).

## Cómo funciona (resumen)

```
Catálogo → Clasificación IA (atributos) → Matriz de obligaciones (lookup) → Checklist → Documentos / Partners
```

**Principio arquitectónico:** la matriz decide, la IA no inventa. El modelo clasifica y redacta textos; la determinación normativa es lookup sobre datos verificados.

Para el detalle técnico, consulta [ARCHITECTURE.md](./ARCHITECTURE.md). Para el flujo completo del software (API, worker, datos, integraciones), consulta [CODEMAP.md](./CODEMAP.md).

## Guía del panel de control

El flujo operativo en cinco pantallas — desde el login hasta la checklist de obligaciones por país.

### 1. Acceso

Inicia sesión con las credenciales de demostración para entrar al panel de la organización.

![Login — acceso al panel Varco](./docs/images/01-login.png)

### 2. Resumen

La página de inicio resume el estado del catálogo: SKU importados, acciones abiertas, obligaciones critical y completadas. La **pipeline de compliance** muestra los cuatro pasos del flujo; los **mercados activos** listan los países MVP (DE, FR, IT, ES, NL).

![Resumen — métricas, pipeline y mercados activos](./docs/images/02-overview.png)

### 3. Sincronizar catálogo

Conecta el mock Shopify (puerto 4010) e importa productos y variantes SKU en la base de datos Varco. Cada sincronización actualiza títulos, materiales, categorías y países objetivo extraídos de las etiquetas.

![Catálogo — sincronización desde mock Shopify](./docs/images/03-catalogo.png)

### 4. Clasificar SKU

Para cada variante puedes iniciar la **clasificación IA**: el modelo extrae atributos estructurados y la **matriz de obligaciones** (no el LLM) determina los requisitos. Desde aquí también se generan los PDF de evaluación de riesgos GPSR.

![SKU — tabla de productos y acciones Clasificar / PDF](./docs/images/04-skus.png)

### 5. Revisar checklist

Las entradas generadas por la matriz aparecen por **SKU × país**: tipo de obligación (expediente técnico, etiquetado, RP, RAP…), **gravedad** (critical / high / …), estado operativo y referencia normativa (p. ej. GPSR Art. 9, CONAI).

![Checklist — obligaciones por país con gravedad y referencias normativas](./docs/images/05-checklist.png)

## Stack tecnológico

| Componente | Tecnología                                          |
| ---------- | --------------------------------------------------- |
| Monorepo   | pnpm + Turborepo                                    |
| Frontend   | Next.js 15, TypeScript                              |
| API        | NestJS                                              |
| Worker     | BullMQ + Redis                                      |
| Database   | PostgreSQL 16, Drizzle ORM                          |
| Auth       | Auth.js v5                                          |
| Storage    | MinIO (local) / S3 (producción)                     |
| LLM        | Proveedor abstracto: `mock` \| `ollama` \| `openai` |

## Inicio rápido

Demo local completa en pocos minutos.

### Requisitos previos

- Docker Desktop
- Node.js ≥ 20
- pnpm ≥ 9

### Configuración

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

En un segundo terminal, con `pnpm dev` activo, rellena catálogo, checklist y PDF de demostración:

```bash
pnpm demo:populate
```

| Servicio | URL                   |
| -------- | --------------------- |
| Web      | http://localhost:3000 |
| API      | http://localhost:3001 |
| Mailhog  | http://localhost:8025 |
| MinIO    | http://localhost:9001 |

Con `LLM_PROVIDER=mock` y `SHOPIFY_API_MODE=mock` no se necesitan claves API externas para el desarrollo local.

**Panel de demostración:** http://localhost:3000 — login `admin@varco.local` / `admin` (tras `pnpm db:seed`).  
Para rellenar catálogo, checklist y PDF: `pnpm demo:populate` (con `pnpm dev` activo).

Guía completa para contribuidores: [CONTRIBUTING.md](./CONTRIBUTING.md).

## Estructura del repositorio

```
varco/
├── apps/
│   ├── web/          # Panel Next.js
│   ├── api/          # Backend REST
│   └── worker/       # Jobs asíncronos
├── packages/
│   ├── auth/         # JWT y sesiones
│   ├── database/     # Esquema y migraciones (Drizzle)
│   ├── matrix/       # Matriz de obligaciones (YAML + validación)
│   ├── classification/ # Pipeline IA → atributos estructurados
│   ├── documents/    # Plantillas y generación PDF GPSR
│   ├── queue/        # Definiciones de jobs BullMQ
│   └── shared/       # Utilidades compartidas
├── mocks/
│   └── mock-server/  # API mock (Shopify, Amazon, Partners)
├── fixtures/         # Datos de prueba
├── docker/           # Scripts de init Postgres
└── docker-compose.yml
```

## Glosario

| Término  | Significado                                                                                  |
| -------- | -------------------------------------------------------------------------------------------- |
| **GPSR** | Reglamento general de seguridad de los productos (UE), en vigor desde diciembre de 2024      |
| **EPR**  | Extended Producer Responsibility — registro y contribuciones por envases/productos, por país |
| **PPWR** | Reglamento UE sobre envases y residuos de envases                                            |
| **RP**   | Responsible Person — entidad establecida en la UE responsable de la conformidad              |
| **DoC**  | Declaración de Conformidad                                                                   |
| **SKU**  | Artículo individual del catálogo                                                             |

## Licencia

El código se publica como **source available** con todos los derechos reservados. Consulta [LICENSE](./LICENSE).

- Consulta del código en GitHub: permitida con fines informativos no comerciales
- Fork, modificación, despliegue o uso (incluso personal): requiere autorización escrita del titular
- Uso comercial: requiere licencia comercial separada

Las contribuciones al repositorio se aceptan solo por invitación.

## Documentación

| Documento                                            | Contenido                                                      |
| ---------------------------------------------------- | -------------------------------------------------------------- |
| [CODEMAP.md](./CODEMAP.md)                           | Flujo de software end-to-end, API, worker, BD, integraciones   |
| [PROGRESS.md](./PROGRESS.md)                         | Estado de implementación e historial de sesiones               |
| [BACKLOG.md](./BACKLOG.md)                           | Trabajo pendiente priorizado (MVP → post-MVP)                  |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                 | Arquitectura del sistema, dominios, decisiones, modelo de datos |
| [design/README.md](./design/README.md)               | Sistema visual de referencia (Replit-inspired)                 |
| [design/replit/DESIGN.md](./design/replit/DESIGN.md) | Tokens de color, tipografía, componentes UI                    |
| [CONTRIBUTING.md](./CONTRIBUTING.md)                 | Setup de desarrollo, estándares de código, proceso PR         |
