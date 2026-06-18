# Varco — Guida al progetto

Guida visiva e interattiva a cosa fa Varco, per chi è pensato e come funziona il flusso compliance.

## Apri la guida

**In locale** (con `pnpm dev` attivo):

**http://localhost:3000/guida**

La pagina è pubblica — non serve login. Usa il design system Replit già presente nella dashboard (colori, tipografia, card bento, animazioni).

## Cosa contiene

| Sezione | Contenuto |
|---------|-----------|
| **Hero** | Presentazione del prodotto e CTA verso demo |
| **Il problema** | GPSR, EPR, complessità cross-border |
| **Per chi** | Brand D2C, seller marketplace, categorie MVP |
| **Funzionalità** | Bento grid: catalogo, AI, checklist, documenti, partner |
| **Principio** | «La matrice decide, l'AI non inventa» |
| **Flusso** | Pipeline animata a 5 passi + dettaglio operativo |
| **Dashboard** | Walkthrough con screenshot delle 5 schermate |
| **MVP** | 5 categorie × 5 paesi |
| **Architettura** | Vista semplificata web → API → worker → dati |
| **Avvio rapido** | Comandi per la demo locale |
| **Documentazione** | Link a CODEMAP, PROGRESS, BACKLOG, ecc. |

## Documentazione correlata

- [CODEMAP.md](./CODEMAP.md) — flusso tecnico dettagliato
- [PROGRESS.md](./PROGRESS.md) — stato implementazione
- [BACKLOG.md](./BACKLOG.md) — lavoro rimanente
- [ARCHITECTURE.md](./ARCHITECTURE.md) — decisioni architetturali
- [README.md](./README.md) — panoramica e quick start

## Sviluppo

File principali:

```
apps/web/src/app/guida/page.tsx
apps/web/src/components/guide/ProjectGuide.tsx
apps/web/src/components/guide/guide.module.css
docs/images/                    # screenshot dashboard (unica fonte, usata anche da README)
```

La route `/guida` è esclusa dall’auth in `middleware.ts`.
