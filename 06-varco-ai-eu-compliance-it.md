# Varco — Copilot AI di Compliance per Vendere in Europa

## One-liner

Varco trasforma le normative europee sui prodotti (GPSR, EPR, etichettatura, PPWR) da 27 Paesi di testo legale in una checklist per SKU con documenti auto-generati — così i piccoli brand vendono in tutta Europa senza un consulente da 5.000 € per mercato.

## Indice

1. [Problema risolto](#problema-risolto)
2. [Perché ora](#perché-ora)
3. [Utente target](#utente-target)
4. [Dimensione del mercato](#dimensione-del-mercato)
5. [Funzionalità principali](#funzionalità-principali)
6. [Come funziona — MVP e architettura](#come-funziona--mvp-e-architettura)
7. [Concorrenza e posizionamento](#concorrenza-e-posizionamento)
8. [Modello di pricing](#modello-di-pricing)
9. [Unit economics](#unit-economics)
10. [Perché continuano ad abbonarsi](#perché-continuano-ad-abbonarsi)
11. [Go-to-market — primi 100 clienti](#go-to-market--primi-100-clienti)
12. [Piano di validazione](#piano-di-validazione)
13. [Roadmap 12 mesi](#roadmap-12-mesi)
14. [KPI da monitorare](#kpi-da-monitorare)
15. [Rischio principale](#rischio-principale)
16. [Glossario](#glossario)

## Problema risolto

A dicembre 2024 è entrato in vigore il GPSR e migliaia di piccoli seller americani, inglesi e asiatici hanno semplicemente geo-bloccato l'Europa — non perché non potessero adeguarsi, ma perché nessuno sapeva dirgli _cosa significasse la compliance per i loro prodotti_. Ogni prodotto immesso sul mercato UE richiede un Responsible Person, un fascicolo tecnico con risk assessment, documentazione di conformità, etichettatura a norma e la registrazione EPR imballaggi Paese per Paese (LUCID in Germania, Citeo in Francia, CONAI in Italia — ognuno con portale, tariffe e scadenze proprie). Il PPWR aggiunge una nuova ondata di obblighi da agosto 2026, con ulteriori fasi nel 2028 e 2030. Gli obblighi sono per Paese, per categoria, e cambiano in continuazione. Le opzioni attuali: consulenti da 2–5k € a mercato, servizi frammentati mono-obbligo, o rinunciare al mercato. Ogni checkout geo-bloccato è fatturato regalato alla burocrazia.

## Perché ora

- **Il GPSR ha creato il momento di panico** — in vigore dal 13 dicembre 2024, ha spinto migliaia di seller UK/USA a ritirarsi dall'UE: Etsy ha persino introdotto un opt-out a livello negozio per l'intera area EEA, e la stampa UK documenta seller che perdono un terzo del fatturato. Il dolore è acuto, riconosciuto e cercato attivamente su Google.
- **Il PPWR è la prossima ondata, già calendarizzata** — si applica da agosto 2026, con fasi successive nel 2028 e 2030: ogni scadenza è un picco di domanda prevedibile su cui costruire il funnel.
- **Amazon ha lasciato un vuoto** — ha chiuso il proprio programma «EPR Services on Amazon» a fine 2024, spingendo i seller verso fornitori terzi proprio mentre gli obblighi aumentavano.
- **Gli LLM rendono trattabile il problema** — classificare migliaia di SKU su matrici di obblighi multi-Paese e redigere bozze di fascicoli era economicamente impossibile da automatizzare prima; ora è un problema di orchestrazione AI + revisione esperta.
- **Gli incumbent guardano altrove** — Avalara e i grandi TIC presidiano tasse e certificazioni enterprise; i servizi EPR esistenti sono mono-obbligo. Nessuno possiede il layer end-to-end per il piccolo seller.

## Utente target

Brand D2C e seller marketplace (Shopify, Amazon, Etsy) con 10–500 SKU e 100k–10M € di fatturato, che vendono — o vogliono vendere — cross-border verso o dentro l'UE: giocattoli, cosmetici, accessori elettronici, abbigliamento, casa. Il buyer è il founder o l'ops manager che ha ricevuto una mail di sospensione da Amazon e non ha un legale interno. Secondario: agenzie e-commerce e aggregatori che gestiscono la compliance di molti brand insieme.

## Dimensione del mercato

| Livello      | Stima             | Ragionamento                                                                                                                                                            |
| ------------ | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TAM          | €0,5–1,5 mld/anno | 500k–1M di seller con obblighi di compliance prodotto multi-Paese verso/dentro l'UE × €1–3k/anno (oggi spesi in consulenti, servizi frammentati o fatturato rinunciato) |
| SAM          | €150–300M/anno    | 100–150k seller nel segmento 10–500 SKU nelle prime 5 categorie e lingue (EN, IT, DE)                                                                                   |
| SOM a 3 anni | €4–7M ARR         | 1.500–3.000 clienti paganti + take-rate sui servizi intermediati                                                                                                        |

Ancore di mercato:

- L'impatto GPSR è documentato: webinar per piccole imprese con 1.000+ partecipanti, costi di adeguamento stimati >£5.000/anno per una singola SME (stampa UK, 2025), opt-out EEA di massa su Etsy
- ecosistant (solo EPR) serve già 5.000+ seller; AVASK gestisce migliaia di seller Amazon su VAT/EPR — la domanda di compliance-as-a-service è provata
- Il benchmark di prezzo esiste: un consulente costa €2–5k per un solo mercato, una sola volta — più di un anno di piano Growth

Fonti: Etsy Seller Handbook (GPSR), stampa UK (Telegraph, ChannelX/ecommercenews, 2025), siti ecosistant/AVASK/Lizenzero.

## Funzionalità principali

- **Scansione catalogo → mappa obblighi** — colleghi Shopify/Amazon; l'AI classifica ogni SKU per categoria, materiali e mercati target, e produce la lista esatta di obblighi per Paese con gravità e scadenze. Da «27 Paesi di legalese» a «le tue 14 azioni da fare»
- **Costruttore del fascicolo di conformità** — l'AI redige risk assessment, scheletri di fascicolo tecnico, dichiarazioni di conformità e gli elementi di etichetta richiesti (avvertenze, indirizzo RP, simbolo Triman/info di raccolta) per SKU; segnala i documenti fornitore mancanti e li sollecita con richieste automatiche
- **Responsible Person + registrazioni EPR, intermediati** — nomini il Responsible Person UE e ti registri ai sistemi nazionali imballaggi/RAEE tramite partner integrati, da una dashboard sola invece di 27 portali
- **Radar normativo** — monitora le modifiche UE e nazionali (fasi PPWR, regole di categoria), traduce il legalese in linguaggio semplice e dice a ogni seller cosa è cambiato _per i suoi SKU_ e cosa fare
- **Scudo marketplace** — tiene sincronizzati gli attributi di compliance su Amazon/Etsy così le inserzioni non vengono sospese; avvisa prima che un dato mancante inneschi un takedown in 48 ore

## Come funziona — MVP e architettura

**Cosa si costruisce per primo (v1, 4–5 mesi; nel team serve un regulatory lead dal giorno 1, non solo sviluppatori):**

1. **Connettore catalogo** — import da Shopify/Amazon: titoli, descrizioni, materiali, immagini, mercati target
2. **Classificazione SKU** — LLM che mappa ogni SKU su una **matrice di obblighi curata da esperti**; l'AI classifica e redige, la determinazione normativa vive nella matrice verificata, mai nell'output libero del modello
3. **Checklist per Paese** — obblighi con gravità, scadenze e stato; copertura iniziale: **5 categorie × 5 Paesi** (giocattoli, tessile, accessori elettronici, cosmetica, casa × DE, FR, IT, ES, NL) — non 27 Paesi al lancio
4. **Generatore documenti GPSR** — risk assessment, scheletro di fascicolo tecnico, DoC, elementi di etichetta; template per categoria revisionati da umani
5. **RP ed EPR via partner** — nomina del Responsible Person e registrazioni ai consorzi tramite 1–2 partner integrati (si intermedia, non si costruisce)

**Cosa si rimanda:** scudo marketplace (sync attributi), radar completo 27 Paesi, RAEE/batterie, API e workspace agenzie.

**Il moat è operativo:** la matrice degli obblighi mantenuta corretta nel tempo. È un lavoro da analisti regolatori, costoso da replicare, ed è esattamente ciò che nessun puro player AI vorrà fare.

## Concorrenza e posizionamento

| Concorrente                                 | Cosa fa                              | Perché non basta                                                                     |
| ------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------ |
| Consulenti e TIC (SGS, TÜV, Intertek)       | Compliance su misura, certificazioni | €2–5k a mercato, per progetto, non scala sui cataloghi né sul monitoraggio continuo  |
| AVASK                                       | VAT + EPR + RP per seller Amazon     | Service-heavy e tax-led: nessuna automazione per SKU, nessun prodotto self-serve     |
| ecosistant (5k+ seller), Lizenzero          | Registrazioni e dichiarazioni EPR    | Mono-obbligo: niente GPSR, fascicoli, etichette o monitoraggio normativo             |
| ProductIP                                   | Piattaforma per fascicoli tecnici    | Document-centric e pre-AI: prezzo per fascicolo, pensato per importatori strutturati |
| Obelis e Authorised Rep vari                | Solo Responsible Person              | Un singolo obbligo, processi manuali                                                 |
| Tool nativi marketplace (Amazon Compliance) | Raccolta attributi minima            | Solo Amazon, reattivo, nessun supporto multi-canale né EPR                           |

**Posizionamento:** l'unico layer end-to-end seller-facing — classificazione AI → documenti → registrazioni intermediate → monitoraggio continuo — a prezzo SMB. I competitor risolvono un obbligo ciascuno; il seller ne ha quattordici.

## Modello di pricing

| Piano   | Prezzo     | Include                                                                                                                                  |
| ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Starter | 79 €/mese  | Fino a 50 SKU, 3 Paesi, mappa obblighi, generatore documenti, radar normativo                                                            |
| Growth  | 199 €/mese | 250 SKU, tutti i 27 Paesi UE, sync marketplace, sollecito documenti fornitori, calendario adempimenti EPR, RP/registrazioni intermediati |
| Scale   | 499 €/mese | 1.000+ SKU, workspace multi-brand, API, postazioni agenzia, revisione compliance prioritaria                                             |

Àncora rispetto all'alternativa: un consulente, un mercato, una volta sola costa più di un anno di Growth. I servizi intermediati (Responsible Person, registrazioni ai consorzi) sono fatturati a cost-plus: Varco è un SaaS con una take-rate sui servizi incorporata.

## Unit economics

| Voce                     | Stima                                                                                                                       |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| COGS AI                  | trascurabile: <€1 per SKU in onboarding (classificazione + drafting)                                                        |
| COGS vero: knowledge ops | 2 analisti regolatori (~€10–12k/mese) mantengono la matrice per _tutti_ i clienti: costo fisso che si diluisce con la scala |
| Margine lordo            | ~70% all'inizio → 85–90% a scala (il costo della matrice non cresce coi clienti)                                            |
| Servizi intermediati     | cost + 20–30% di take-rate (RP, registrazioni consorzi)                                                                     |
| CAC previsto             | €200–400 (SEO «panic-driven» + community + partner); payback <4 mesi sul piano Growth                                       |
| NRR target               | 110–120% (più SKU, più Paesi, più servizi nel tempo)                                                                        |

La struttura è da SaaS verticale con servizi incorporati: il software scala, gli analisti presidiano la correttezza, i partner erogano gli adempimenti fisici.

## Perché continuano ad abbonarsi

La compliance è strutturalmente un abbonamento: nuovi SKU ogni mese, nuovi mercati ogni trimestre, dichiarazioni EPR e versamenti annuali, fasi PPWR nel 2026, 2028 e 2030, e regole che non smettono mai di cambiare. Il lock-in è brutale e legittimo: il GPSR impone di conservare la documentazione tecnica per 10 anni, e quell'archivio vive dentro Varco — andarsene significa perdere il proprio audit trail. Anche le inserzioni restano in ostaggio: spegni la sincronizzazione e le sospensioni marketplace ricominciano. Il fatturato si espande col cliente (più SKU, più mercati), e i servizi intermediati (nomina RP, registrazioni ai consorzi) aggiungono una take-rate sopra il SaaS.

## Go-to-market — primi 100 clienti

**Beachhead:** seller UK/USA che hanno geo-bloccato l'UE dopo il GPSR (dolore già esploso, si auto-identificano nei forum) + seller UE che hanno ricevuto mail di sospensione marketplace.

1. **SEO sulle scadenze** — «GPSR checklist», «PPWR requirements 2026», «LUCID registration guide»: query ad alto intento generate dal panico normativo; ogni scadenza calendarizzata è un picco di traffico prevedibile
2. **Community di seller** — r/AmazonSellers, r/Etsy, gruppi Facebook UK/USA, forum post-GPSR pieni di seller che hanno smesso di spedire in UE: il prodotto si presenta con un caso reale risolto
3. **Lead magnet «scanner gratuito»** — colleghi il catalogo, 1 SKU analizzato gratis con la mappa obblighi: dimostrazione immediata del valore
4. **Partnership** — commercialisti e-commerce, agenzie Amazon, spedizionieri/3PL e aggregatori: chi già serve i seller cross-border porta lead qualificati in cambio di revenue share
5. **Webinar con associazioni di categoria** — il formato che i seller già usano per capire il GPSR (i webinar da 1.000+ partecipanti esistono già: meglio esserne i relatori)

**Sequenza:** land sul piano Starter con un dolore singolo (la mail di sospensione) → expand verso Growth quando si aggiungono Paesi. Primi 100: ~30 dai forum di seller geo-bloccati, ~30 da SEO/content, ~40 da partner.

## Piano di validazione

Prima di costruire la piattaforma (6–8 settimane):

1. **30 interviste** a seller geo-bloccati o sospesi (reclutati nei forum Etsy/Amazon): cosa li ha fermati, cosa hanno provato, quanto pagherebbero
2. **Concierge su 5 brand** — portare 5 brand reali alla conformità GPSR+EPR per Germania e Francia _a mano_: valida la matrice obblighi, misura le ore per SKU, testa l'economics dei partner RP/consorzi
3. **Landing per categoria con deposito** — «GPSR per chi vende giocattoli», waitlist con deposito €99: misura la conversione per categoria e sceglie il primo verticale
4. **Review legale del perimetro** — _prima_ del lancio: framing «preparazione documenti e dati verificati», mai «consulenza legale»; disclaimers e confini di responsabilità approvati da un legale

**Criteri go/no-go:** 10 clienti concierge paganti a ≥€1.500/anno equivalente; matrice DE+FR completata e validata da un esperto esterno; economics dei partner sostenibili (margine ≥20% sull'intermediazione).

## Roadmap 12 mesi

| Fase            | Mesi | Obiettivo                                                                                                     |
| --------------- | ---- | ------------------------------------------------------------------------------------------------------------- |
| Validazione     | 1–2  | Interviste, concierge 5 brand, accordo con partner RP/EPR, assunzione regulatory lead                         |
| Build MVP       | 3–6  | Connettore catalogo, matrice 5 categorie × 5 Paesi, generatore documenti, checklist; beta chiusa con 20 brand |
| Lancio pubblico | 7    | Agganciato alla scadenza PPWR (agosto 2026): il picco di panico è il momento di massima domanda               |
| Espansione      | 8–12 | Da 5 a 12 Paesi, sync attributi Amazon, calendario EPR, workspace agenzie; target 300 clienti paganti         |

## KPI da monitorare

- **Attivazione:** % di trial che collega il catalogo e riceve la mappa obblighi (target >70%); tempo a «pronto per il mercato X»
- **Valore:** % checklist completate entro 30 giorni; sospensioni marketplace evitate/risolte (il numero da raccontare nei case study)
- **Qualità della matrice:** tasso di errori trovati negli audit trimestrali per Paese (il KPI esistenziale: deve tendere a zero)
- **Monetizzazione:** attach rate dei servizi intermediati (target >40% dei clienti Growth); NRR ≥110%
- **Crescita:** CAC payback <4 mesi; pipeline generata dai picchi normativi (PPWR 2026 → 2028)

## Rischio principale

**Responsabilità e accuratezza.** Un «sei a norma» sbagliato può significare merce sequestrata e multe, quindi il prodotto deve uscire come preparazione documenti e dati verificati — template revisionati da umani per categoria, confini di scopo espliciti, mai «consulenza legale» — perché un fallimento famoso uccide il brand nelle community di seller. Subito dietro: mantenere corretta la base di conoscenza degli obblighi su 27 Paesi è un lavoro operativo da finanziare prima del fatturato (ed è anche il moat), e Avalara o i marketplace stessi potrebbero decidere di possedere questo layer — la finestra è il divario tra il panico GPSR e l'attenzione degli incumbent.

## Glossario

- **GPSR** — General Product Safety Regulation: regolamento UE sulla sicurezza prodotti, in vigore da dicembre 2024
- **EPR** — Extended Producer Responsibility: obbligo di registrarsi e contribuire allo smaltimento di imballaggi/prodotti, Paese per Paese
- **PPWR** — Packaging and Packaging Waste Regulation: regolamento UE imballaggi, si applica da agosto 2026
- **RP (Responsible Person)** — soggetto stabilito nell'UE responsabile della conformità del prodotto
- **DoC** — Dichiarazione di Conformità; **RAEE/WEEE** — rifiuti da apparecchiature elettriche ed elettroniche
- **SKU** — singolo articolo a catalogo; **D2C** — vendita diretta al consumatore
- **TIC** — Testing, Inspection & Certification (SGS, TÜV, Intertek…)
- **Take-rate** — percentuale trattenuta sui servizi intermediati
- **ARR / CAC / NRR / COGS / churn** — metriche SaaS standard: ricavo ricorrente, costo di acquisizione, ricavo netto trattenuto, costi diretti, tasso di disdetta
- **TAM / SAM / SOM** — mercato totale / servibile / realisticamente ottenibile in 3 anni
