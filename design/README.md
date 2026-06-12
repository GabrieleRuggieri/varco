# Design — Varco

Riferimenti visivi e token per UI, landing e componenti.  
**Sistema adottato:** Stripe-inspired ([`design/stripe/DESIGN.md`](./stripe/DESIGN.md)).

---

## Perché Stripe-inspired

Varco è un B2B SaaS su compliance e documenti: serve **fiducia**, chiarezza su numeri/scadenze e un linguaggio da “infrastruttura” (non consumer playful). Il design Stripe-inspired copre:

- Landing e marketing (`index.html`)
- Dashboard prodotto (`apps/web`)
- Tabelle SKU, checklist, pricing, stati di gravità

---

## File di riferimento

| File | Contenuto |
|------|-----------|
| [`stripe/DESIGN.md`](./stripe/DESIGN.md) | Token colori, tipografia, spacing, componenti, do/don't |
| [`stripe/SOURCE.md`](./stripe/SOURCE.md) | Provenienza e licenza del file upstream |

---

## Come usarlo (team e agenti)

1. **Prima di modificare UI** — leggi `stripe/DESIGN.md` e usa i token documentati (`{colors.primary}`, `{typography.body-tabular}`, `{rounded.pill}`, ecc.).
2. **Font in produzione** — Sohne non è disponibile; usa **Inter** weight 300 (display) come sostituto indicato nel DESIGN.md.
3. **Numeri e compliance** — contatori SKU, prezzi, scadenze: `font-feature-settings: "tnum"` (`body-tabular`).
4. **CTA** — un solo pulsante filled indigo per sezione (`button-primary-pill`); il resto outline o ghost.
5. **Dashboard Varco** — mockup prodotto su `{colors.canvas}` / `{colors.canvas-soft}`; tier evidenziato su `{colors.brand-dark-900}`.
6. **Disclaimer legale** — sempre visibile; non usare verde “success” aggressivo per implicare “sei a norma”.

### Mappatura rapida Varco → token

| Elemento Varco | Componente / token DESIGN.md |
|----------------|------------------------------|
| Hero landing | Gradient mesh + `display-xxl` + `nav-bar-on-mesh` |
| Card funzionalità | `card-feature-light` |
| Piani Starter/Growth/Scale | `card-pricing` / `card-pricing-featured` |
| Mock dashboard SKU | `card-dashboard-mockup` + `body-tabular` |
| Tag stato (GPSR, DE, RP) | `pill-tag-soft` |
| Checklist / gravità critical | `ruby` solo come accento, non come CTA |
| Form login / catalogo | `text-input` / `text-input-focused` |

---

## Aggiornamenti

Il file upstream vive in [VoltAgent/awesome-design-md](https://github.com/VoltAgent/awesome-design-md/tree/main/design-md/stripe).  
Per allinearsi a una versione nuova: sostituire `design/stripe/DESIGN.md` e annotare in `WORK_LOG.md`.

Modifiche **specifiche Varco** (es. token semantici compliance) vanno in un file separato `design/varco-extensions.md` — non alterare il DESIGN.md stripe senza motivo.

---

## Collegamenti

- [CONTRIBUTING.md](../CONTRIBUTING.md) — standard di codice e UI
- [ARCHITECTURE.md](../ARCHITECTURE.md) — stack frontend
- [WORK_LOG.md](../WORK_LOG.md) — cronologia
