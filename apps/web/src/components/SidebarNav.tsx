'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconBox, IconCheckSquare, IconHome, IconList } from './icons';
import styles from './AppShell.module.css';

const NAV = [
  { href: '/', label: 'Panoramica', icon: IconHome, exact: true },
  { href: '/catalog', label: 'Catalogo', icon: IconBox, exact: false },
  { href: '/skus', label: 'SKU', icon: IconList, exact: false },
  { href: '/checklist', label: 'Checklist', icon: IconCheckSquare, exact: false },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className={styles.navSection}>
      <p className={styles.navLabel}>Navigazione</p>
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link key={href} href={href} className={active ? styles.navLinkActive : styles.navLink}>
            <Icon size={15} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
