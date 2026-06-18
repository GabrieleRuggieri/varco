import Link from 'next/link';
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
          Il sistema per obblighi prodotto e documenti GPSR — pensato per brand e seller che vendono
          in Europa.
        </p>
        <Suspense
          fallback={<p style={{ color: 'var(--color-ink-subtle)', fontSize: 13 }}>Caricamento…</p>}
        >
          <LoginForm />
        </Suspense>
        {process.env.NODE_ENV === 'development' && (
          <div className={styles.footer}>
            <span className={styles.footerDot} />
            <p className={styles.footerText}>Ambiente demo · admin@varco.local / admin</p>
          </div>
        )}
      </div>
      <p className={styles.bottomNote}>
        Varco prepara documenti e dati strutturati. Non è consulenza legale.{' '}
        <Link href="/guida" className={styles.guideLink}>
          Guida al progetto →
        </Link>
      </p>
    </div>
  );
}
