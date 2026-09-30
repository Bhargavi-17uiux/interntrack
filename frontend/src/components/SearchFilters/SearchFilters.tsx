/**
 * SearchFilters.tsx — Search and Filter Bar
 *
 * A client component that handles search, status filtering, and sorting.
 * It calls a callback when filters change, so the parent page
 * can refetch data with the new filters.
 */

'use client';

import { ApplicationFilters } from '@/types';
import { STATUS_OPTIONS } from '@/lib/utils';
import styles from './SearchFilters.module.css';

interface SearchFiltersProps {
  filters: ApplicationFilters;
  onFiltersChange: (filters: ApplicationFilters) => void;
  totalCount: number;
}

export default function SearchFilters({
  filters,
  onFiltersChange,
  totalCount,
}: SearchFiltersProps) {
  // Generic handler — update one filter field at a time
  function handleChange(field: keyof ApplicationFilters, value: string) {
    onFiltersChange({ ...filters, [field]: value });
  }

  function handleClear() {
    onFiltersChange({
      search: '',
      status: '',
      sortBy: 'applicationDate',
      order: 'desc',
    });
  }

  const hasActiveFilters = filters.search || filters.status;

  return (
    <div className={styles.container}>
      <div className={styles.filtersRow}>
        {/* Search box */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            id="search-input"
            type="text"
            placeholder="Search by company or role..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className={styles.searchInput}
          />
          {filters.search && (
            <button
              className={styles.clearSearch}
              onClick={() => handleChange('search', '')}
              aria-label="Clear search"
              id="clear-search-btn"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          id="status-filter"
          value={filters.status}
          onChange={(e) => handleChange('status', e.target.value)}
          className={styles.select}
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Sort by */}
        <select
          id="sort-by-filter"
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className={styles.select}
        >
          <option value="applicationDate">Sort: Date Applied</option>
          <option value="createdAt">Sort: Date Added</option>
          <option value="companyName">Sort: Company Name</option>
        </select>

        {/* Sort order */}
        <button
          id="sort-order-btn"
          className={styles.orderBtn}
          onClick={() => handleChange('order', filters.order === 'desc' ? 'asc' : 'desc')}
          title={`Currently: ${filters.order === 'desc' ? 'Newest first' : 'Oldest first'}`}
        >
          {filters.order === 'desc' ? '↓ Newest' : '↑ Oldest'}
        </button>

        {/* Clear filters */}
        {hasActiveFilters && (
          <button
            id="clear-filters-btn"
            className={styles.clearBtn}
            onClick={handleClear}
          >
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <div className={styles.resultCount}>
        {totalCount} {totalCount === 1 ? 'application' : 'applications'} found
      </div>
    </div>
  );
}
