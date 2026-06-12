# Design — Varco

Riferimenti visivi e token per UI, landing e componenti.  
**Sistema adottato:** Linear-inspired ([`design/linear/DESIGN.md`](./linear/DESIGN.md)).

---

## Perché Linear-inspired

Varco è un B2B SaaS su checklist, stati e documenti compliance: serve **precisione operativa**, densità informativa e un tono da tool pro (non consumer playful). Il design Linear-inspired copre:

- Dashboard prodotto (`apps/web`) — dark-first, lavender accent `#5e6ad2`
- Tabelle SKU, checklist, stati e gravità obblighi
- Flussi task: sync → classifica → PDF

Riferimento storico Stripe: [`design/stripe/`](./stripe/) (sostituito come sistema primario).

---

## File di riferimento

| File | Contenuto |
|------|-----------|
| [`linear/DESIGN.md`](./linear/DESIGN.md) | Token colori, tipografia, spacing, componenti, do/don't |
| [`linear/SOURCE.md`](./linear/SOURCE.md) | Provenienza e licenza del file upstream |
| [`stripe/DESIGN.md`](./stripe/DESIGN.md) | Archivio — precedente riferimento |

---

## Come usarlo (team e agenti)

1. **Prima di modificare UI** — leggi `linear/DESIGN.md` e usa i token (`{colors.primary}`, `{colors.surface-1}`, `{rounded.md}`, ecc.).
2. **Font in produzione** — Linear custom non disponibile; usa **Inter** 400 (body), 500–600 (titoli).
3. **Numeri e compliance** — SKU, scadenze, contatori: `font-variant-numeric: tabular-nums`.
4. **CTA** — un solo pulsante filled lavender per sezione (`button-primary`); secondari su `surface-1` con hairline.
5. **Dashboard** — canvas `#010102`, card su `surface-1`, testo `ink` chiaro.
6. **Disclaimer legale** — sempre visibile; non usare verde `semantic-success` per implicare “sei a norma”.

### Mappatura rapida Varco → token

| Elemento Varco | Componente / token DESIGN.md |
|----------------|------------------------------|
| Shell dashboard | `canvas` + sidebar `surface-2` |
| Card SKU / checklist | `card-panel` / `surface-1` + `hairline` |
| Tabella dati | `body-sm` + header `caption` uppercase |
| Tag stato obbligo | `pill-tag` su `surface-3` |
| Gravità critical | accento rosso custom — **non** CTA primaria |
| Form login | `text-input` su `surface-1`, focus ring `primary` |

---

## Aggiornamenti

Il file upstream vive in [awesome-design-md — linear.app](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/linear.app).  
Per allinearsi a una versione nuova: sostituire `design/linear/DESIGN.md` e annotare in `WORK_LOG.md`.

Modifiche **specifiche Varco** (es. token semantici compliance) vanno in `design/varco-extensions.md` — non alterare il DESIGN.md linear senza motivo.

---

## Collegamenti

- [CONTRIBUTING.md](../CONTRIBUTING.md) — standard di codice e UI
- [ARCHITECTURE.md](../ARCHITECTURE.md) — stack frontend
- [WORK_LOG.md](../WORK_LOG.md) — cronologia
