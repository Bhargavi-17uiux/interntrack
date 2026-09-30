/**
 * page.tsx — Dashboard Page (/)
 *
 * This is the home/dashboard page.
 * It shows statistics cards and a quick overview of recent applications.
 *
 * In Next.js App Router, every page.tsx file is a route.
 * This one handles the "/" (root) route.
 *
 * It's a Client Component because we need to fetch data
 * and manage loading/error states interactively.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Stats, Application } from '@/types';
import { fetchStats, fetchApplications } from '@/lib/api';
import StatCard from '@/components/StatCard/StatCard';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { formatDate } from '@/lib/utils';
import styles from './page.module.css';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentApps, setRecentApps] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);
        // Fetch both stats and recent applications in parallel
        const [statsData, appsData] = await Promise.all([
          fetchStats(),
          fetchApplications({ sortBy: 'createdAt', order: 'desc' }),
        ]);
        setStats(statsData);
        // Show only the 5 most recent
        setRecentApps(appsData.slice(0, 5));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner" />
        <p className={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className="error-message">
          <strong>⚠️ Connection Error</strong>
          <p>{error}</p>
          <p style={{ marginTop: '8px', fontSize: '0.8rem' }}>
            Make sure the backend server is running on port 5000.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Track your internship journey — all in one place.
          </p>
        </div>
        <Link href="/applications/new" className="btn-primary" id="dashboard-add-btn">
          ➕ Add Application
        </Link>
      </header>

      {/* Stats Grid */}
      {stats && (
        <section className={styles.statsGrid} aria-label="Application statistics">
          <StatCard
            label="Total Applications"
            value={stats.total}
            icon="📁"
            colorClass="primary"
            description="All time"
          />
          <StatCard
            label="Applied"
            value={stats.applied}
            icon="📤"
            colorClass="blue"
            description="Waiting for response"
          />
          <StatCard
            label="Interviews"
            value={stats.interview}
            icon="💬"
            colorClass="yellow"
            description="In progress"
          />
          <StatCard
            label="Offers"
            value={stats.offer}
            icon="🎉"
            colorClass="green"
            description="Congratulations!"
          />
          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon="❌"
            colorClass="red"
            description="Keep going!"
          />
          <StatCard
            label="Withdrawn"
            value={stats.withdrawn}
            icon="↩️"
            colorClass="gray"
            description="Withdrawn by you"
          />
        </section>
      )}

      {/* Recent Applications */}
      <section className={styles.recentSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Applications</h2>
          <Link href="/applications" className={styles.viewAll} id="view-all-link">
            View all →
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className={styles.emptyDashboard}>
            <span className={styles.emptyEmoji}>🚀</span>
            <h3>Start tracking your applications!</h3>
            <p>Add your first internship application to get started.</p>
            <Link href="/applications/new" className="btn-primary" id="empty-dash-btn">
              Add Application
            </Link>
          </div>
        ) : (
          <div className={styles.recentList}>
            {recentApps.map((app) => (
              <Link
                key={app.id}
                href={`/applications/${app.id}`}
                className={styles.recentItem}
                id={`recent-app-${app.id}`}
              >
                <div className={styles.recentAvatar}>
                  {app.companyName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.recentInfo}>
                  <div className={styles.recentCompany}>{app.companyName}</div>
                  <div className={styles.recentRole}>{app.jobRole}</div>
                </div>
                <div className={styles.recentMeta}>
                  <StatusBadge status={app.status} />
                  <span className={styles.recentDate}>
                    {formatDate(app.applicationDate)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
