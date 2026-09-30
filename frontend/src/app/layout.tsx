/**
 * layout.tsx — Root Layout
 *
 * In Next.js App Router, layout.tsx wraps every page.
 * This is where we put:
 * - Global metadata (title, description for SEO)
 * - Global CSS imports
 * - Shared UI like sidebar navigation
 */

import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'InternTrack — Internship Application Tracker',
  description:
    'Track all your internship applications in one place. Monitor status, manage interviews, and land your dream internship.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className={styles.appLayout}>
          {/* Sidebar navigation — visible on all pages */}
          <Sidebar />

          {/* Main content area */}
          <main className={styles.mainContent}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
