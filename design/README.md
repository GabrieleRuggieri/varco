# Design — Varco

Riferimenti visivi e token per UI, landing e componenti.  
**Sistema adottato:** Replit-inspired ([`design/replit/DESIGN.md`](./replit/DESIGN.md)).

---

## Perché Replit-inspired

Varco è un copilot operativo per compliance prodotto: serve chiarezza, energia creativa e un tono accessibile (non dark enterprise). Il design Replit-inspired copre:

- Dashboard prodotto (`apps/web`) — canvas caldo `#faf6f1`, accento arancione `#ff3c00`
- Tabelle SKU, checklist, stati e gravità obblighi
- Flussi task: sync → classifica → PDF
- Doodle SVG e mesh decorativi su sfondo chiaro

Riferimenti archiviati: [`design/stripe/`](./stripe/) (precedente), ~~`design/linear/`~~ (rimosso).

---

## File di riferimento

| File | Contenuto |
|------|-----------|
| [`replit/DESIGN.md`](./replit/DESIGN.md) | Token colori, tipografia, principi UI |
| [`replit/SOURCE.md`](./replit/SOURCE.md) | Provenienza e riferimenti brand |
| [`stripe/DESIGN.md`](./stripe/DESIGN.md) | Archivio — precedente riferimento |

Implementazione CSS: `apps/web/src/app/globals.css` (`:root`).

---

## Come usarlo (team e agenti)

1. **Prima di modificare UI** — leggi `replit/DESIGN.md` e usa i token CSS (`--color-primary`, `--color-canvas`, ecc.).
2. **Font in produzione** — ABC Diatype non disponibile; usa **IBM Plex Sans** (400–700) e **IBM Plex Mono** per codice.
3. **Numeri e compliance** — SKU, scadenze, contatori: `font-variant-numeric: tabular-nums` (classe `.tnum`).
4. **CTA** — pulsante filled arancione (`--color-primary`); secondari bianchi con bordo hairline.
5. **Dashboard** — canvas `#faf6f1`, card bianche, testo ink scuro.
6. **Disclaimer legale** — sempre visibile; non usare verde success per implicare “sei a norma”.

### Mappatura rapida Varco → token

| Elemento Varco | Token CSS |
|----------------|-----------|
| Shell dashboard | `--color-canvas` + sidebar `--color-glass` |
| Card SKU / checklist | `--color-surface-1` + `--color-hairline` |
| Tabella dati | body 13px + header caption uppercase |
| Tag stato obbligo | `--color-surface-2` + pill border |
| Gravità critical | `--color-critical` — non CTA primaria |
| Form login | `--color-surface-1`, focus `--color-primary` |

---

## Aggiornamenti

Riferimenti ufficiali: [replit.com](https://replit.com), [replit.com/brand](https://replit.com/brand).  
Modifiche token Varco: aggiornare `globals.css` e annotare in `WORK_LOG.md`.

---

## Collegamenti

- [CONTRIBUTING.md](../CONTRIBUTING.md) — standard di codice e UI
- [ARCHITECTURE.md](../ARCHITECTURE.md) — stack frontend
- [WORK_LOG.md](../WORK_LOG.md) — cronologia
