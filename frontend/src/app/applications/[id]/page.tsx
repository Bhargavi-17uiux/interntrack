/**
 * /applications/[id]/page.tsx — Application Detail Page
 *
 * Dynamic route — Next.js App Router uses [id] folder name
 * to capture the ID from the URL.
 *
 * Example: /applications/clx1234 → id = "clx1234"
 *
 * Shows all details of a single application with
 * edit and delete buttons.
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Application } from '@/types';
import { fetchApplication, deleteApplication } from '@/lib/api';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setIsLoading(true);
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

  async function handleDelete() {
    if (!application) return;
    if (!window.confirm(`Delete this application to ${application.companyName}? This cannot be undone.`)) return;

    setIsDeleting(true);
    try {
      await deleteApplication(id);
      router.push('/applications');
    } catch {
      alert('Failed to delete. Please try again.');
      setIsDeleting(false);
    }
  }

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
        <div className="error-message">
          ⚠️ {error ?? 'Application not found'}
        </div>
        <Link href="/applications" className="btn-secondary" style={{ marginTop: '16px', display: 'inline-flex' }}>
          ← Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link href="/applications" className={styles.breadcrumbLink}>Applications</Link>
        <span className={styles.breadcrumbSep}>›</span>
        <span className={styles.breadcrumbCurrent}>{application.companyName}</span>
      </nav>

      {/* Header */}
      <div className={styles.detailHeader}>
        <div className={styles.companyBlock}>
          <div className={styles.companyAvatar}>
            {application.companyName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className={styles.companyName}>{application.companyName}</h1>
            <p className={styles.jobRole}>{application.jobRole}</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          <StatusBadge status={application.status} />
          <Link
            href={`/applications/${id}/edit`}
            className="btn-secondary"
            id="edit-btn"
          >
            ✏️ Edit
          </Link>
          <button
            className="btn-danger"
            onClick={handleDelete}
            disabled={isDeleting}
            id="delete-btn"
          >
            {isDeleting ? '⏳ Deleting...' : '🗑️ Delete'}
          </button>
        </div>
      </div>

      {/* Details Grid */}
      <div className={styles.detailGrid}>
        <div className={styles.detailCard}>
          <h2 className={styles.cardTitle}>Application Details</h2>

          <div className={styles.fieldList}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>📅 Application Date</span>
              <span className={styles.fieldValue}>{formatDate(application.applicationDate)}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>📍 Location</span>
              <span className={styles.fieldValue}>{application.location ?? 'Not specified'}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>🔗 Job Posting</span>
              <span className={styles.fieldValue}>
                {application.jobPostingUrl ? (
                  <a
                    href={application.jobPostingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                    id="job-posting-link"
                  >
                    View Job Posting ↗
                  </a>
                ) : (
                  'Not provided'
                )}
              </span>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>🕐 Added On</span>
              <span className={styles.fieldValue}>{formatDate(application.createdAt)}</span>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>🔄 Last Updated</span>
              <span className={styles.fieldValue}>{formatDate(application.updatedAt)}</span>
            </div>
          </div>
        </div>

        {/* Notes / Job Description */}
        {application.jobDescription && (
          <div className={`${styles.detailCard} ${styles.notesCard}`}>
            <h2 className={styles.cardTitle}>Notes / Job Description</h2>
            <p className={styles.jobDescription}>{application.jobDescription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
