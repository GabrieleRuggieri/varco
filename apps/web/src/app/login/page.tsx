import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.mesh} aria-hidden />
      <div className={styles.grid} aria-hidden />
      <div className={styles.orb} aria-hidden />
      <div className={styles.doodles} aria-hidden>
        <svg className={styles.star} viewBox="0 0 48 48" fill="none">
          <path
            d="M24 4l4.8 14.8H44L30 28.4l4.8 15.6L24 33.6 11.2 44 16 28.4 2 18.8h15.2L24 4z"
            stroke="#ff3c00"
            strokeWidth="1.5"
            fill="rgba(255,60,0,0.06)"
          />
        </svg>
        <svg className={styles.squiggle} viewBox="0 0 120 40" fill="none">
          <path
            d="M4 28C20 8 40 36 60 20s40-8 56 12"
            stroke="#2492ff"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className={styles.card}>
        <div className={styles.logoArea}>
          <span className={styles.logoMark}>V</span>
          <h1 className={styles.title}>Varco</h1>
        </div>
        <p className={styles.subtitle}>
          Il sistema per obblighi prodotto e documenti GPSR — pensato per brand e seller che vendono in Europa.
        </p>
        <Suspense fallback={<p style={{ color: 'var(--color-ink-subtle)', fontSize: 13 }}>Caricamento…</p>}>
          <LoginForm />
        </Suspense>
        <div className={styles.footer}>
          <span className={styles.footerDot} />
          <p className={styles.footerText}>Ambiente demo · admin@varco.local / admin</p>
        </div>
      </div>
      <p className={styles.bottomNote}>
        Varco prepara documenti e dati strutturati. Non è consulenza legale.
      </p>
    </div>
  );
}
