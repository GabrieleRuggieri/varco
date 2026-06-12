import type { ReactNode } from 'react';
import type { VarcoSession } from '@/lib/session';
import styles from './AppShell.module.css';
import { LogoutButton } from './LogoutButton';
import { SidebarNav } from './SidebarNav';

export function AppShell({ session, children }: { session: VarcoSession; children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logoMark}>V</span>
          <span className={styles.logoText}>Varco</span>
        </div>
        <SidebarNav />
        <div className={styles.user}>
          <p className={styles.userOrg}>{session.organizationName}</p>
          <p className={styles.userEmail}>{session.email}</p>
          <LogoutButton />
        </div>
      </aside>
      <div className={styles.main}>
        <header className={styles.topbar}>
          <p className={styles.disclaimer}>
            Varco supporta la preparazione di documenti e dati strutturati. Non è consulenza legale.
          </p>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
}
