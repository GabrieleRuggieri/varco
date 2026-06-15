'use client';

import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import styles from './ui/ui.module.css';
import loginStyles from './LoginForm.module.css';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Credenziali non valide');
      setLoading(false);
      return;
    }

    const from = searchParams.get('callbackUrl') ?? '/';
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

      <button
        type="submit"
        className={styles.primary}
        disabled={loading}
        style={{ padding: '10px 14px', fontSize: 14, marginTop: 4 }}
      >
        {loading ? 'Accesso…' : 'Accedi alla dashboard →'}
      </button>
    </form>
  );
}
