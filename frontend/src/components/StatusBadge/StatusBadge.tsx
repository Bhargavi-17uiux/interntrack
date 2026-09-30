/**
 * StatusBadge.tsx — Status Badge Component
 *
 * Displays an application's status as a colored pill badge.
 * Reused in the table, detail view, and form.
 */

import { ApplicationStatus } from '@/types';
import { STATUS_LABELS, STATUS_CLASSES } from '@/lib/utils';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  // The badge classes are defined in globals.css
  // e.g., "badge badge-applied", "badge badge-interview"
  return (
    <span className={`badge badge-${STATUS_CLASSES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}
