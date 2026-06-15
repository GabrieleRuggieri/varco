import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.mesh} aria-hidden />
      <div className={styles.grid} aria-hidden />
      <div className={styles.orb} aria-hidden />
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
          <p className={styles.footerText}>Ambiente demo · demo@varco.local</p>
        </div>
      </div>
      <p className={styles.bottomNote}>
        Varco prepara documenti e dati strutturati. Non è consulenza legale.
      </p>
    </div>
  );
}
