/**
 * Sidebar.tsx — Navigation Sidebar
 *
 * The sidebar is a "Client Component" because it needs:
 * - usePathname() hook (requires browser APIs)
 * - Interactive mobile toggle
 *
 * 'use client' tells Next.js to render this in the browser, not on the server.
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Sidebar.module.css';

// Navigation items — each has an icon (emoji), label, and href
const navItems = [
  { icon: '📊', label: 'Dashboard', href: '/' },
  { icon: '📋', label: 'Applications', href: '/applications' },
  { icon: '➕', label: 'Add Application', href: '/applications/new' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className={styles.mobileToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle navigation"
        id="mobile-nav-toggle"
      >
        <span className={`${styles.hamburger} ${isOpen ? styles.open : ''}`} />
      </button>

      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        {/* Brand / Logo */}
        <div className={styles.brand}>
          <div className={styles.brandIcon}>🎯</div>
          <div>
            <div className={styles.brandName}>InternTrack</div>
            <div className={styles.brandTagline}>Application Tracker</div>
          </div>
        </div>

        {/* Navigation */}
        <nav className={styles.nav} aria-label="Main navigation">
          <ul className={styles.navList}>
            {navItems.map((item) => {
              // Check if this link is the current page
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                    onClick={() => setIsOpen(false)}
                    id={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span className={styles.navLabel}>{item.label}</span>
                    {isActive && <span className={styles.activeDot} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className={styles.sidebarFooter}>
          <div className={styles.footerText}>
            Built with Next.js + Express
          </div>
          <div className={styles.footerSubtext}>
            Full-Stack Portfolio Project
          </div>
        </div>
      </aside>
    </>
  );
}
