'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import type { ReactNode } from 'react';
import { IconBox, IconCheckSquare, IconDocument, IconSparkle, IconSync } from '@/components/icons';
import loginShot from '../../../../../docs/images/01-login.png';
import overviewShot from '../../../../../docs/images/02-overview.png';
import catalogShot from '../../../../../docs/images/03-catalogo.png';
import skusShot from '../../../../../docs/images/04-skus.png';
import checklistShot from '../../../../../docs/images/05-checklist.png';
import { useReveal } from './useReveal';
import styles from './guide.module.css';

function Section({
  id,
  children,
  className,
}: {
  id: string;
  children: ReactNode;
  className?: string;
}) {
  const { ref, visible } = useReveal<HTMLElement>();
  return (
    <section
      id={id}
      ref={ref}
      className={`${styles.section} ${visible ? styles.sectionVisible : ''} ${className ?? ''}`}
    >
      {children}
    </section>
  );
}

const FLOW_STEPS = [
  {
    label: 'Catalogo',
    sub: 'Shopify / Amazon',
    color: '#2492ff',
    bg: 'rgba(36, 146, 255, 0.1)',
    icon: IconBox,
    detail: 'Importi prodotti, varianti SKU, materiali e mercati target dal tuo store.',
  },
  {
    label: 'Classifica',
    sub: 'AI → attributi',
    color: '#ff3c00',
    bg: 'rgba(255, 60, 0, 0.08)',
    icon: IconSparkle,
    detail:
      "L'AI estrae categoria, materiali, età e attributi strutturati — non decide gli obblighi.",
  },
  {
    label: 'Matrice',
    sub: 'Lookup normativo',
    color: '#ff764c',
    bg: 'rgba(255, 118, 76, 0.1)',
    icon: IconCheckSquare,
    detail: 'Regole curate da esperti mappano attributi → obblighi GPSR/EPR per paese.',
  },
  {
    label: 'Checklist',
    sub: 'SKU × paese',
    color: '#ec4e02',
    bg: 'rgba(236, 78, 2, 0.08)',
    icon: IconSync,
    detail: 'Ogni voce ha gravità, riferimento normativo e stato operativo (open → completed).',
  },
  {
    label: 'Documenti',
    sub: 'PDF + partner',
    color: '#1a9e4a',
    bg: 'rgba(26, 158, 74, 0.08)',
    icon: IconDocument,
    detail: 'Bozze risk assessment, fascicolo tecnico, DoC; orchestrazione RP/EPR via partner.',
  },
] as const;

const DASHBOARD_STEPS: {
  num: number;
  title: string;
  body: string;
  img: StaticImageData;
  alt: string;
  reverse: boolean;
}[] = [
  {
    num: 1,
    title: 'Accesso',
    body: 'Entra nella dashboard organizzazione con le credenziali demo. Ogni seller vede solo il proprio catalogo e le proprie checklist.',
    img: loginShot,
    alt: 'Schermata login Varco',
    reverse: false,
  },
  {
    num: 2,
    title: 'Panoramica',
    body: 'Metriche in tempo reale: SKU importati, azioni aperte, obblighi critical e completati. La pipeline compliance riassume i 4 passi del flusso.',
    img: overviewShot,
    alt: 'Panoramica dashboard con metriche e pipeline',
    reverse: true,
  },
  {
    num: 3,
    title: 'Sincronizza catalogo',
    body: 'Collega il mock Shopify (o il connettore live) e importa prodotti e varianti. Tag come varco_category e varco_markets guidano classificazione e paesi.',
    img: catalogShot,
    alt: 'Pagina sincronizzazione catalogo',
    reverse: false,
  },
  {
    num: 4,
    title: 'Classifica SKU',
    body: 'Per ogni variante avvii la classificazione AI. La matrice obblighi — non il modello — determina i requisiti. Da qui generi anche i PDF GPSR.',
    img: skusShot,
    alt: 'Tabella SKU con azioni classifica e PDF',
    reverse: true,
  },
  {
    num: 5,
    title: 'Rivedi checklist',
    body: 'Obblighi per SKU × paese: fascicolo tecnico, etichettatura, RP, EPR… con gravità, riferimenti normativi (es. GPSR Art. 9) e stato.',
    img: checklistShot,
    alt: 'Checklist obblighi per paese',
    reverse: false,
  },
];

const DOCS = [
  {
    href: 'https://github.com/GabrieleRuggieri/varco/blob/main/CODEMAP.md',
    name: 'CODEMAP',
    desc: 'Flusso software end-to-end',
  },
  {
    href: 'https://github.com/GabrieleRuggieri/varco/blob/main/PROGRESS.md',
    name: 'PROGRESS',
    desc: 'Stato implementazione',
  },
  {
    href: 'https://github.com/GabrieleRuggieri/varco/blob/main/BACKLOG.md',
    name: 'BACKLOG',
    desc: 'Lavoro rimanente',
  },
  {
    href: 'https://github.com/GabrieleRuggieri/varco/blob/main/ARCHITECTURE.md',
    name: 'ARCHITECTURE',
    desc: 'Decisioni e modello dati',
  },
  {
    href: 'https://github.com/GabrieleRuggieri/varco/blob/main/CONTRIBUTING.md',
    name: 'CONTRIBUTING',
    desc: 'Setup sviluppatore',
  },
  {
    href: 'https://github.com/GabrieleRuggieri/varco/blob/main/README.md',
    name: 'README',
    desc: 'Panoramica e quick start',
  },
] as const;

const NAV = [
  { href: '#problema', label: 'Problema' },
  { href: '#funzionalita', label: 'Funzioni' },
  { href: '#flusso', label: 'Flusso' },
  { href: '#dashboard', label: 'Dashboard' },
  { href: '#architettura', label: 'Sistema' },
  { href: '#avvio', label: 'Avvio' },
] as const;

export function ProjectGuide() {
  return (
    <div className={styles.page}>
      <div className={styles.bg} aria-hidden>
        <div className={styles.mesh} />
        <div className={styles.grid} />
        <div className={`${styles.orb} ${styles.orbA}`} />
        <div className={`${styles.orb} ${styles.orbB}`} />
      </div>

      <header className={styles.nav}>
        <Link href="/guida" className={styles.navBrand}>
          <span className={styles.navLogo}>V</span>
          <span className={styles.navTitle}>Varco — Guida</span>
        </Link>
        <nav className={styles.navLinks} aria-label="Sezioni guida">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </nav>
        <Link href="/login" className={styles.navCta}>
          Apri dashboard
        </Link>
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            GPSR · EPR · UE — MVP demo
          </div>
          <h1 className={styles.heroTitle}>Compliance europea, una checklist alla volta</h1>
          <p className={styles.heroLead}>
            Varco è il copilot per brand e seller che vendono in Europa: dal catalogo agli obblighi
            per SKU, con documenti GPSR da template revisionati — senza navigare decine di portali
            normativi da soli.
          </p>
          <div className={styles.heroActions}>
            <a href="#flusso" className={styles.btnPrimary}>
              Scopri il flusso
            </a>
            <Link href="/login" className={styles.btnSecondary}>
              Prova la demo
            </Link>
          </div>
        </section>

        {/* Problema */}
        <Section id="problema">
          <p className={styles.eyebrow}>Il problema</p>
          <h2 className={styles.title}>27 paesi di legalese, centinaia di SKU</h2>
          <p className={styles.lead}>
            Dal dicembre 2024 il GPSR impone Responsible Person, fascicolo tecnico, dichiarazione di
            conformità, etichettatura e registrazioni EPR imballaggi —{' '}
            <strong>paese per paese</strong>,<strong> categoria per categoria</strong>. Il PPWR
            aggiunge obblighi dal 2026. Consulenti costosi e servizi mono-obbligo non scalano su
            cataloghi da 10 a 500 SKU.
          </p>
        </Section>

        {/* Per chi */}
        <Section id="per-chi">
          <p className={styles.eyebrow}>Per chi è Varco</p>
          <h2 className={styles.title}>Brand D2C e seller su marketplace</h2>
          <p className={styles.lead}>
            Shopify, Amazon, Etsy — giocattoli, cosmetica, elettronica, tessile, casa. Per chi vende
            o vuole vendere in Germania, Francia, Italia, Spagna e Paesi Bassi.
          </p>
          <div className={styles.pillGrid}>
            {[
              '🧸 Giocattoli',
              '👕 Tessile',
              '🔌 Elettronica',
              '💄 Cosmetica',
              '🏠 Casa',
              '🇩🇪 🇫🇷 🇮🇹 🇪🇸 🇳🇱',
            ].map((p) => (
              <span key={p} className={styles.pill}>
                {p}
              </span>
            ))}
          </div>
        </Section>

        {/* Funzionalità bento */}
        <Section id="funzionalita">
          <p className={styles.eyebrow}>Cosa fa</p>
          <h2 className={styles.title}>Dal catalogo alla conformità operativa</h2>
          <p className={styles.lead}>
            Cinque capacità integrate in un unico flusso — ispirate ai pattern UI moderni (bento,
            cards con shine) ma costruite sul design system Varco.
          </p>
          <div className={styles.bento}>
            <div className={`${styles.cardShine} ${styles.bentoWide}`}>
              <div
                className={styles.featureIcon}
                style={{ color: '#2492ff', background: 'rgba(36,146,255,0.08)' }}
              >
                <IconBox size={20} />
              </div>
              <h3 className={styles.cardTitle}>Scansione catalogo</h3>
              <p className={styles.cardBody}>
                Collegamento a Shopify (prioritario) e Amazon. Import titoli, descrizioni,
                materiali, immagini e mercati target in un database strutturato per SKU.
              </p>
            </div>
            <div className={`${styles.cardShine} ${styles.bentoNarrow}`}>
              <div
                className={styles.featureIcon}
                style={{ color: '#ff3c00', background: 'rgba(255,60,0,0.08)' }}
              >
                <IconSparkle size={20} />
              </div>
              <h3 className={styles.cardTitle}>Classificazione AI</h3>
              <p className={styles.cardBody}>
                Attributi strutturati estratti dal prodotto. Gli obblighi non li inventa il modello.
              </p>
            </div>
            <div className={`${styles.cardShine} ${styles.bentoThird}`}>
              <div
                className={styles.featureIcon}
                style={{ color: '#ff764c', background: 'rgba(255,118,76,0.1)' }}
              >
                <IconCheckSquare size={20} />
              </div>
              <h3 className={styles.cardTitle}>Checklist per paese</h3>
              <p className={styles.cardBody}>
                Gravità, scadenze, stato — le tue N azioni concrete.
              </p>
            </div>
            <div className={`${styles.cardShine} ${styles.bentoThird}`}>
              <div
                className={styles.featureIcon}
                style={{ color: '#1a9e4a', background: 'rgba(26,158,74,0.08)' }}
              >
                <IconDocument size={20} />
              </div>
              <h3 className={styles.cardTitle}>Documenti GPSR</h3>
              <p className={styles.cardBody}>
                Risk assessment, fascicolo tecnico, DoC, etichetta — da template.
              </p>
            </div>
            <div className={`${styles.cardShine} ${styles.bentoThird}`}>
              <div
                className={styles.featureIcon}
                style={{ color: '#ec4e02', background: 'rgba(236,78,2,0.08)' }}
              >
                <IconSync size={20} />
              </div>
              <h3 className={styles.cardTitle}>RP ed EPR</h3>
              <p className={styles.cardBody}>
                Orchestrazione partner per Responsible Person e consorzi.
              </p>
            </div>
          </div>
        </Section>

        {/* Principio */}
        <Section id="principio">
          <div className={`${styles.cardGlow} ${styles.principleBox}`}>
            <p className={styles.principleQuote}>La matrice decide, l&apos;AI non inventa</p>
            <p className={styles.principleSub}>
              Il modello classifica e redige testi. La determinazione normativa è lookup su righe
              verificate in <code>packages/matrix</code> — mai output libero dell&apos;LLM su cosa è
              obbligatorio.
            </p>
          </div>
        </Section>

        {/* Flusso animato */}
        <Section id="flusso">
          <p className={styles.eyebrow}>Flusso end-to-end</p>
          <h2 className={styles.title}>Come funziona Varco</h2>
          <p className={styles.lead}>
            Cinque passi dal tuo store alla checklist operativa. La barra animata sotto mostra il
            percorso tipico di un SKU nel sistema.
          </p>
          <div className={`${styles.cardGlow} ${styles.flowWrap}`}>
            <div className={styles.flowTrack} aria-hidden>
              <div className={styles.flowTrackFill} />
            </div>
            <div className={styles.flowSteps}>
              {FLOW_STEPS.map((step) => (
                <div key={step.label} className={styles.flowStep}>
                  <div
                    className={styles.flowNode}
                    style={{ color: step.color, background: step.bg }}
                  >
                    <step.icon size={20} />
                  </div>
                  <p className={styles.flowLabel}>{step.label}</p>
                  <p className={styles.flowSub}>{step.sub}</p>
                </div>
              ))}
            </div>
            <div className={styles.flowDetail}>
              {FLOW_STEPS.map((step, i) => (
                <div key={step.label} className={styles.flowDetailItem}>
                  <p className={styles.flowDetailNum}>PASSO {i + 1}</p>
                  <p className={styles.cardTitle}>{step.label}</p>
                  <p className={styles.cardBody}>{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Dashboard */}
        <Section id="dashboard">
          <p className={styles.eyebrow}>Guida dashboard</p>
          <h2 className={styles.title}>Cinque schermate, un flusso</h2>
          <p className={styles.lead}>
            Dalla login alla checklist obblighi — con screenshot reali della demo locale.
          </p>
          <div className={styles.walkthrough}>
            {DASHBOARD_STEPS.map((step) => (
              <div
                key={step.num}
                className={step.reverse ? styles.walkStepReverse : styles.walkStep}
              >
                <div>
                  <span className={styles.walkNum}>{step.num}</span>
                  <h3 className={styles.walkTitle}>{step.title}</h3>
                  <p className={styles.walkBody}>{step.body}</p>
                </div>
                <div className={styles.shotFrame}>
                  <div className={styles.shotDots} aria-hidden>
                    <span className={styles.shotDot} />
                    <span className={styles.shotDot} />
                    <span className={styles.shotDot} />
                  </div>
                  <Image
                    src={step.img}
                    alt={step.alt}
                    className={styles.shotImg}
                    sizes="(max-width: 800px) 100vw, 55vw"
                    placeholder="blur"
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* MVP */}
        <Section id="mvp">
          <p className={styles.eyebrow}>Perimetro MVP</p>
          <h2 className={styles.title}>5 categorie × 5 paesi</h2>
          <p className={styles.lead}>
            Versione v1 focalizzata sui mercati e verticali più comuni per seller cross-border.
            Matrice in stato bozza con disclaimer visibile — non afferma conformità legale.
          </p>
          <div className={styles.pillGrid}>
            {['toys', 'apparel', 'electronics_accessories', 'cosmetics', 'home'].map((c) => (
              <span key={c} className={styles.pill}>
                {c}
              </span>
            ))}
          </div>
        </Section>

        {/* Architettura */}
        <Section id="architettura">
          <p className={styles.eyebrow}>Sotto il cofano</p>
          <h2 className={styles.title}>Come è costruito il software</h2>
          <p className={styles.lead}>
            Monorepo con dashboard, API, worker asincroni e matrice obblighi versionata. I job
            pesanti (sync, classificazione, PDF) girano in background su Redis/BullMQ.
          </p>
          <div className={styles.archStack}>
            <div className={styles.archRow}>
              <span className={styles.archChip}>apps/web — Dashboard</span>
            </div>
            <div className={styles.archConnector} aria-hidden />
            <div className={styles.archRow}>
              <span className={styles.archChip}>apps/api — REST NestJS</span>
              <span className={styles.archChip}>BFF /api/v1</span>
            </div>
            <div className={styles.archConnector} aria-hidden />
            <div className={styles.archRow}>
              <span className={styles.archChip}>Redis + BullMQ</span>
              <span className={styles.archChip}>apps/worker</span>
            </div>
            <div className={styles.archConnector} aria-hidden />
            <div className={styles.archRow}>
              <span className={styles.archChip}>PostgreSQL</span>
              <span className={styles.archChip}>MinIO (PDF)</span>
              <span className={styles.archChip}>mock-server</span>
            </div>
          </div>
          <div className={`${styles.card} ${styles.bentoFull}`} style={{ marginTop: '1.5rem' }}>
            <h3 className={styles.cardTitle}>Job asincroni principali</h3>
            <p className={styles.cardBody}>
              <strong>catalog.sync</strong> — import prodotti da Shopify mock/live ·{' '}
              <strong>sku.classify</strong> — LLM mock + matchRules sulla matrice ·{' '}
              <strong>document.generate</strong> — PDF risk assessment in MinIO
            </p>
          </div>
        </Section>

        {/* Avvio rapido */}
        <Section id="avvio">
          <p className={styles.eyebrow}>Avvio rapido</p>
          <h2 className={styles.title}>Prova la demo in locale</h2>
          <p className={styles.lead}>
            Docker per l&apos;infrastruttura, pnpm per le app. Nessuna chiave API esterna con i mock
            attivi.
          </p>
          <pre className={styles.codeBlock}>
            {`docker compose up -d
pnpm install && cp .env.example .env
pnpm db:migrate && pnpm db:seed && pnpm matrix:seed
pnpm dev
pnpm demo:populate   # secondo terminale

# Dashboard: http://localhost:3000
# Login demo: admin@varco.local / admin`}
          </pre>
        </Section>

        {/* Documentazione */}
        <Section id="documentazione">
          <p className={styles.eyebrow}>Approfondimenti</p>
          <h2 className={styles.title}>Documentazione tecnica</h2>
          <p className={styles.lead}>
            Per sviluppatori e contributor: architettura, code map, backlog e progress nel
            repository.
          </p>
          <div className={styles.docGrid}>
            {DOCS.map((doc) => (
              <a
                key={doc.name}
                href={doc.href}
                className={styles.docLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className={styles.docName}>{doc.name}</p>
                <p className={styles.docDesc}>{doc.desc}</p>
              </a>
            ))}
          </div>
        </Section>

        <p className={styles.disclaimer}>
          <strong>Importante:</strong> Varco supporta la preparazione di documenti e dati
          strutturati. Non è consulenza legale e non certifica la conformità del prodotto. Ogni
          output include disclaimer espliciti.
        </p>

        <p className={styles.footer}>
          Varco — Copilot AI di compliance per vendere in Europa ·{' '}
          <Link href="/login">Accedi alla dashboard</Link>
        </p>
      </main>
    </div>
  );
}
