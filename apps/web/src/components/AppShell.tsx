/**
 * Componente React `AppShell` — interfaccia utente Varco.
 */
import type { ReactNode } from 'react';
import type { VarcoSession } from '@/lib/session';
import { AmbientMesh } from './AmbientMesh';
import styles from './AppShell.module.css';
import { LogoutButton } from './LogoutButton';
import { SidebarNav } from './SidebarNav';

/** Esportazione `AppShell` — vedi implementazione sotto. */
export function AppShell({ session, children }: { session: VarcoSession; children: ReactNode }) {
  const initials = session.email.slice(0, 2).toUpperCase();

  return (
    <div className={styles.shell}>
      <AmbientMesh />
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>V</span>
          <span className={styles.logoText}>Varco</span>
        </div>

        <SidebarNav />

        <div className={styles.user}>
          <div className={styles.userCard}>
            <div className={styles.userAvatar}>{initials}</div>
            <div className={styles.userInfo}>
              <p className={styles.userOrg}>{session.organizationName}</p>
              <p className={styles.userEmail}>{session.email}</p>
            </div>
            <span className={styles.statusDot} title="Sessione attiva" />
          </div>
          <LogoutButton />
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <p className={styles.disclaimer}>
            <span className={styles.disclaimerDot} />
            Varco prepara documenti e dati strutturati. Non è consulenza legale.
          </p>
        </header>
        <div className={styles.content}>
          <div className={styles.pageInner}>{children}</div>
        </div>
      </div>
    </div>
  );
}
