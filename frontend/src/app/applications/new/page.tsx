/**
 * /applications/new/page.tsx — Add Application Page
 *
 * A simple wrapper page around the ApplicationForm component.
 * The form itself handles all the logic.
 */

import ApplicationForm from '@/components/ApplicationForm/ApplicationForm';
import styles from './page.module.css';

// This page has no dynamic data so it can be a Server Component (no 'use client')
export default function NewApplicationPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Add Application</h1>
          <p className={styles.subtitle}>
            Record a new internship application you have submitted.
          </p>
        </div>
      </header>

      <div className={styles.formCard}>
        <ApplicationForm />
      </div>
    </div>
  );
}
