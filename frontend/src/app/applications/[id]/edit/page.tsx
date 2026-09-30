/**
 * /applications/[id]/edit/page.tsx — Edit Application Page
 *
 * Fetches the existing application data, then renders
 * the ApplicationForm pre-filled with that data.
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Application } from '@/types';
import { fetchApplication } from '@/lib/api';
import ApplicationForm from '@/components/ApplicationForm/ApplicationForm';
import styles from './page.module.css';

export default function EditApplicationPage() {
  const params = useParams();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchApplication(id);
        setApplication(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Application not found');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className="spinner" />
        <p>Loading application...</p>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className={styles.page}>
        <div className="error-message">⚠️ {error ?? 'Application not found'}</div>
        <Link href="/applications" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <nav className={styles.breadcrumb}>
            <Link href="/applications" className={styles.breadcrumbLink}>Applications</Link>
            <span> › </span>
            <Link href={`/applications/${id}`} className={styles.breadcrumbLink}>
              {application.companyName}
            </Link>
            <span> › </span>
            <span>Edit</span>
          </nav>
          <h1 className={styles.title}>Edit Application</h1>
          <p className={styles.subtitle}>
            Update your application to {application.companyName}.
          </p>
        </div>
      </header>

      <div className={styles.formCard}>
        <ApplicationForm existingApplication={application} />
      </div>
    </div>
  );
}
