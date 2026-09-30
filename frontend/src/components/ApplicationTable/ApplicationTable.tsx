/**
 * ApplicationTable.tsx — Applications Data Table
 *
 * Displays all applications in a responsive table with:
 * - Status badges
 * - Formatted dates
 * - Edit and delete action buttons
 * - Clickable rows to view details
 * - Empty state when no results
 */

'use client';

import Link from 'next/link';
import { Application } from '@/types';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { formatDate, truncate } from '@/lib/utils';
import styles from './ApplicationTable.module.css';

interface ApplicationTableProps {
  applications: Application[];
  onDelete: (id: string, companyName: string) => void;
  isDeleting: string | null; // ID of the application being deleted
}

export default function ApplicationTable({
  applications,
  onDelete,
  isDeleting,
}: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>📭</div>
        <h3 className={styles.emptyTitle}>No applications found</h3>
        <p className={styles.emptyText}>
          Try adjusting your search or filters, or add a new application.
        </p>
        <Link href="/applications/new" className="btn-primary" id="empty-state-add-btn">
          ➕ Add Your First Application
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Location</th>
            <th>Applied On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className={styles.row}>
              <td className={styles.companyCell}>
                <Link
                  href={`/applications/${app.id}`}
                  className={styles.companyLink}
                >
                  <div className={styles.companyAvatar}>
                    {app.companyName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className={styles.companyName}>{app.companyName}</div>
                    {app.jobPostingUrl && (
                      <a
                        href={app.jobPostingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.jobLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View posting ↗
                      </a>
                    )}
                  </div>
                </Link>
              </td>

              <td>
                <span className={styles.roleText}>
                  {truncate(app.jobRole, 40)}
                </span>
              </td>

              <td>
                <span className={styles.locationText}>
                  {app.location ?? '—'}
                </span>
              </td>

              <td>
                <span className={styles.dateText}>
                  {formatDate(app.applicationDate)}
                </span>
              </td>

              <td>
                <StatusBadge status={app.status} />
              </td>

              <td>
                <div className={styles.actions}>
                  <Link
                    href={`/applications/${app.id}`}
                    className={`btn-icon ${styles.actionBtn}`}
                    title="View details"
                    id={`view-app-${app.id}`}
                  >
                    👁️
                  </Link>
                  <Link
                    href={`/applications/${app.id}/edit`}
                    className={`btn-icon ${styles.actionBtn}`}
                    title="Edit application"
                    id={`edit-app-${app.id}`}
                  >
                    ✏️
                  </Link>
                  <button
                    className={`btn-icon ${styles.actionBtn} ${styles.deleteBtn}`}
                    title="Delete application"
                    onClick={() => onDelete(app.id, app.companyName)}
                    disabled={isDeleting === app.id}
                    id={`delete-app-${app.id}`}
                  >
                    {isDeleting === app.id ? '⏳' : '🗑️'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
