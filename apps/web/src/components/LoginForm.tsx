'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DEMO_EMAIL } from '@/lib/config';
import styles from './ui/ui.module.css';
import loginStyles from './LoginForm.module.css';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(DEMO_EMAIL);
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      setError(data.error ?? 'Accesso non riuscito');
      setLoading(false);
      return;
    }

    const from = searchParams.get('from') ?? '/';
    router.push(from);
    router.refresh();
  }

  return (
    <form className={loginStyles.form} onSubmit={(e) => void onSubmit(e)}>
      <label className={styles.label} htmlFor="email">
        Email
      </label>
      <input
        id="email"
        className={styles.input}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
        required
      />

      <label className={styles.label} htmlFor="password">
        Password
      </label>
      <input
        id="password"
        className={styles.input}
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />

      {error ? <p className={styles.alertError}>{error}</p> : null}

      <button type="submit" className={styles.primary} disabled={loading}>
        {loading ? 'Accesso…' : 'Accedi alla dashboard'}
      </button>

      <p className={loginStyles.hint}>Demo: {DEMO_EMAIL} / demo</p>
    </form>
  );
}
