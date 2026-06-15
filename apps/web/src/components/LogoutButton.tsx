'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IconLogout } from './icons';
import styles from './AppShell.module.css';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  }

  return (
    <button type="button" className={styles.logoutBtn} onClick={() => void logout()} disabled={loading}>
      <IconLogout size={13} />
      {loading ? 'Uscita…' : 'Esci'}
    </button>
  );
}
