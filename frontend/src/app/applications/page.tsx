/**
 * /applications/page.tsx — Applications List Page
 *
 * Shows all applications in a searchable, filterable table.
 * Handles searching, filtering, and deleting inline.
 */

'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Application, ApplicationFilters } from '@/types';
import { fetchApplications, deleteApplication } from '@/lib/api';
import ApplicationTable from '@/components/ApplicationTable/ApplicationTable';
import SearchFilters from '@/components/SearchFilters/SearchFilters';
import styles from './page.module.css';

// Default filter values
const DEFAULT_FILTERS: ApplicationFilters = {
  search: '',
  status: '',
  sortBy: 'applicationDate',
  order: 'desc',
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filters, setFilters] = useState<ApplicationFilters>(DEFAULT_FILTERS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch applications whenever filters change
  // useCallback prevents creating a new function reference on every render
  const loadApplications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchApplications(filters);
      setApplications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load applications');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadApplications();
  }, [loadApplications]);

  async function handleDelete(id: string, companyName: string) {
    // Simple confirmation dialog
    if (!window.confirm(`Delete application to ${companyName}? This cannot be undone.`)) {
      return;
    }

    setIsDeleting(id);
    try {
      await deleteApplication(id);
      // Remove from local state without refetching
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch {
      alert('Failed to delete application. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Applications</h1>
          <p className={styles.subtitle}>
            Manage and track all your internship applications.
          </p>
        </div>
        <Link href="/applications/new" className="btn-primary" id="add-application-btn">
          ➕ Add Application
        </Link>
      </header>

      {/* Search & Filters */}
      <SearchFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalCount={applications.length}
      />

      {/* Loading */}
      {isLoading && (
        <div className={styles.loadingWrapper}>
          <div className="spinner" />
          <span className={styles.loadingText}>Loading applications...</span>
        </div>
      )}

      {/* Error */}
      {error && !isLoading && (
        <div className="error-message">
          ⚠️ {error}
          <button
            onClick={loadApplications}
            style={{ marginLeft: '12px', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Applications Table */}
      {!isLoading && !error && (
        <ApplicationTable
          applications={applications}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
