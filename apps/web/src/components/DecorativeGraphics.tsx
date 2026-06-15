import styles from './DecorativeGraphics.module.css';

/** Doodle SVG ispirati alle grafiche decorative di replit.com */
export function DecorativeGraphics() {
  return (
    <div className={styles.root} aria-hidden>
      {/* Squiggle blu */}
      <svg className={`${styles.doodle} ${styles.squiggle}`} viewBox="0 0 120 40" fill="none">
        <path
          d="M4 28C20 8 40 36 60 20s40-8 56 12"
          stroke="var(--color-accent-blue)"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      {/* Cerchio tratteggiato coral */}
      <svg className={`${styles.doodle} ${styles.circle}`} viewBox="0 0 80 80" fill="none">
        <circle
          cx="40"
          cy="40"
          r="32"
          stroke="var(--color-accent-coral)"
          strokeWidth="2"
          strokeDasharray="6 8"
          opacity="0.45"
        />
      </svg>

      {/* Plus decorativo */}
      <svg className={`${styles.doodle} ${styles.plus}`} viewBox="0 0 32 32" fill="none">
        <path
          d="M16 6v20M6 16h20"
          stroke="var(--color-ink-tertiary)"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.35"
        />
      </svg>

      {/* Blob peach — bottom left */}
      <svg className={`${styles.doodle} ${styles.blob}`} viewBox="0 0 200 200" fill="none">
        <path
          d="M100 20c40 0 72 28 72 68 0 48-32 92-72 92S28 136 28 88C28 48 60 20 100 20z"
          fill="url(#peachGrad)"
          opacity="0.35"
        />
        <defs>
          <radialGradient id="peachGrad" cx="0.3" cy="0.3" r="0.8">
            <stop offset="0%" stopColor="#ffb199" />
            <stop offset="100%" stopColor="#ff764c" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      {/* Spark dots */}
      <svg className={`${styles.doodle} ${styles.dots}`} viewBox="0 0 60 60" fill="none">
        <circle cx="10" cy="10" r="3" fill="var(--color-primary)" opacity="0.5" />
        <circle cx="40" cy="20" r="2" fill="var(--color-accent-blue)" opacity="0.45" />
        <circle cx="25" cy="45" r="2.5" fill="var(--color-accent-coral)" opacity="0.4" />
      </svg>
    </div>
  );
}
