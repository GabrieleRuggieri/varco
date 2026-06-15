import styles from './CompliancePipeline.module.css';
import { IconBox, IconCheckSquare, IconDocument, IconSparkle } from './icons';

const STEPS = [
  { label: 'Catalogo', sub: 'Sync Shopify', icon: IconBox, color: '#828fff' },
  { label: 'Classifica', sub: 'AI + matrice', icon: IconSparkle, color: '#5e6ad2' },
  { label: 'Checklist', sub: 'Obblighi UE', icon: IconCheckSquare, color: '#e8c84a' },
  { label: 'Documenti', sub: 'PDF GPSR', icon: IconDocument, color: '#30a46c' },
] as const;

/** Diagramma pipeline compliance — ispirato alle product screenshots di linear.app */
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
