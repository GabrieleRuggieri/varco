import styles from './CompliancePipeline.module.css';
import { IconBox, IconCheckSquare, IconDocument, IconSparkle } from './icons';

const STEPS = [
  { label: 'Catalogo', sub: 'Sync Shopify', icon: IconBox, color: '#2492ff' },
  { label: 'Classifica', sub: 'AI + matrice', icon: IconSparkle, color: '#ff3c00' },
  { label: 'Checklist', sub: 'Obblighi UE', icon: IconCheckSquare, color: '#ff764c' },
  { label: 'Documenti', sub: 'PDF GPSR', icon: IconDocument, color: '#1a9e4a' },
] as const;

/** Diagramma pipeline compliance — stile replit.com */
export function CompliancePipeline() {
  return (
    <div className={styles.wrap}>
      <div className={styles.track} aria-hidden />
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <div key={step.label} className={styles.step} style={{ animationDelay: `${i * 80}ms` }}>
            <div
              className={styles.node}
              style={{ ['--node-color' as string]: step.color }}
            >
              <step.icon size={16} />
            </div>
            <p className={styles.label}>{step.label}</p>
            <p className={styles.sub}>{step.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
