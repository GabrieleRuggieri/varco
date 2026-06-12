'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AppShell.module.css';

const NAV = [
  { href: '/', label: 'Panoramica', exact: true },
  { href: '/catalog', label: 'Catalogo', exact: false },
  { href: '/skus', label: 'SKU', exact: false },
  { href: '/checklist', label: 'Checklist', exact: false },
] as const;

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav}>
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? styles.navLinkActive : styles.navLink}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
