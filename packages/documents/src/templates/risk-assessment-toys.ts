/**
 * Package condiviso `risk-assessment-toys` — logica riusabile nel monorepo Varco.
 */
import PDFDocument from 'pdfkit';
import type { DocumentTemplateId } from '@varco/shared';

/** Esportazione `RiskAssessmentContext` — vedi implementazione sotto. */
export type RiskAssessmentContext = {
  organizationName: string;
  skuCode: string;
  productTitle: string;
  productDescription?: string | null;
  materials: string[];
  targetCountries: string[];
  productCategory: string;
  classificationConfidence?: number;
  generatedAt: string;
  templateId: DocumentTemplateId;
  templateVersion: string;
};

const WATERMARK = 'BOZZA — NON È CONSULENZA LEGALE';

type PdfDoc = InstanceType<typeof PDFDocument>;

function drawWatermark(doc: PdfDoc): void {
  const { width, height } = doc.page;
  doc.save();
  doc.rotate(-35, { origin: [width / 2, height / 2] });
  doc
    .fontSize(42)
    .fillColor('#e5e7eb')
    .text(WATERMARK, 40, height / 2 - 20, {
      width: width + 200,
      align: 'center',
    });
  doc.restore();
  doc.fillColor('#111827');
}

function sectionTitle(doc: PdfDoc, title: string): void {
  doc.moveDown(0.6).fontSize(13).fillColor('#111827').text(title, { underline: true });
  doc.moveDown(0.3).fontSize(10).fillColor('#374151');
}

/** Genera PDF risk assessment giocattoli (GPSR Art. 9(5)) — template umano v1. */
export function renderRiskAssessmentPdf(ctx: RiskAssessmentContext): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: 56,
      info: {
        Title: `Risk Assessment — ${ctx.skuCode}`,
        Author: 'Varco',
        Subject: 'GPSR Product Safety Assessment (draft)',
      },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    drawWatermark(doc);

    doc.fontSize(20).fillColor('#111827').text('Valutazione della sicurezza del prodotto', {
      align: 'left',
    });
    doc
      .moveDown(0.2)
      .fontSize(10)
      .fillColor('#6b7280')
      .text('GPSR — Regolamento (UE) 2023/988 · Art. 9(5) · Categoria: giocattoli');
    doc.moveDown(0.8);

    sectionTitle(doc, '1. Identificazione prodotto');
    doc.text(`Organizzazione: ${ctx.organizationName}`);
    doc.text(`SKU: ${ctx.skuCode}`);
    doc.text(`Titolo: ${ctx.productTitle}`);
    if (ctx.productDescription) {
      doc.text(`Descrizione: ${ctx.productDescription}`);
    }
    doc.text(`Categoria classificata: ${ctx.productCategory}`);
    if (ctx.classificationConfidence != null) {
      doc.text(
        `Confidenza classificazione AI: ${(ctx.classificationConfidence * 100).toFixed(0)}%`,
      );
    }

    sectionTitle(doc, '2. Materiali e mercati target');
    doc.text(`Materiali: ${ctx.materials.length > 0 ? ctx.materials.join(', ') : '—'}`);
    doc.text(`Paesi di commercializzazione: ${ctx.targetCountries.join(', ')}`);

    sectionTitle(doc, '3. Analisi dei rischi (bozza strutturata)');
    const hazards = [
      'Rischio meccanico (parti piccole, spigoli) — da verificare con EN 71-1',
      'Rischio chimico (migrazione sostanze, coloranti) — richiede documentazione fornitore',
      "Rischio di soffocamento / etichettatura età — verificare limiti d'età su etichetta",
      'Tracciabilità lotto e richiami — procedura interna da definire',
    ];
    for (const hazard of hazards) {
      doc.text(`• ${hazard}`, { indent: 12 });
    }

    sectionTitle(doc, '4. Misure di mitigazione proposte');
    doc.text('• Etichettatura CE e avvertenze età secondo norme applicabili');
    doc.text('• Fascicolo tecnico con prove di conformità EN 71 (da completare)');
    doc.text("• Nomina Responsible Person UE prima dell'immissione sul mercato");
    doc.text('• Conservazione documentazione per 10 anni');

    sectionTitle(doc, '5. Dichiarazione');
    doc.text(
      'Documento generato automaticamente da Varco come bozza di lavoro. ' +
        "Richiede revisione umana qualificata prima dell'uso. " +
        'Non costituisce consulenza legale né certificazione di conformità.',
    );

    doc
      .moveDown(1)
      .fontSize(8)
      .fillColor('#9ca3af')
      .text(`Template: ${ctx.templateId} v${ctx.templateVersion} · Generato: ${ctx.generatedAt}`, {
        align: 'right',
      });

    doc.end();
  });
}
