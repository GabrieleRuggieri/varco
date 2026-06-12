import { Suspense } from 'react';
import { LoginForm } from '@/components/LoginForm';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <div className={styles.mesh} aria-hidden />
      <div className={styles.card}>
        <h1 className={styles.title}>Varco</h1>
        <p className={styles.subtitle}>Copilot di compliance per vendere in Europa</p>
        <Suspense fallback={<p>Caricamento…</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
