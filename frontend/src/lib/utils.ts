/**
 * utils.ts — Utility / Helper Functions
 *
 * Small, pure functions used across the app.
 * Pure means: given the same input, always returns the same output,
 * with no side effects.
 */

import { ApplicationStatus } from '../types';

/**
 * Format a date string to a readable format.
 * e.g., "2024-03-15T00:00:00.000Z" → "Mar 15, 2024"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date string to YYYY-MM-DD for HTML date inputs.
 * e.g., "2024-03-15T00:00:00.000Z" → "2024-03-15"
 */
export function formatDateForInput(dateString: string): string {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

/**
 * Get today's date as YYYY-MM-DD string (for date input default value).
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Map a status value to a human-readable label.
 */
export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  APPLIED: 'Applied',
  INTERVIEW: 'Interview',
  OFFER: 'Offer',
  REJECTED: 'Rejected',
  WITHDRAWN: 'Withdrawn',
};

/**
 * Map a status to a CSS class name suffix for badge styling.
 */
export const STATUS_CLASSES: Record<ApplicationStatus, string> = {
  APPLIED: 'applied',
  INTERVIEW: 'interview',
  OFFER: 'offer',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn',
};

/**
 * All available status options (for dropdowns/filters).
 */
export const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'APPLIED', label: 'Applied' },
  { value: 'INTERVIEW', label: 'Interview' },
  { value: 'OFFER', label: 'Offer Received' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WITHDRAWN', label: 'Withdrawn' },
];

/**
 * Truncate a string to a maximum length with ellipsis.
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}
