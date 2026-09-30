/**
 * StatCard.tsx — Dashboard Statistic Card
 *
 * A reusable card that displays a single number stat with a label,
 * icon, and color accent. Used on the Dashboard page.
 */

import styles from './StatCard.module.css';

interface StatCardProps {
  label: string;
  value: number;
  icon: string;
  colorClass: 'primary' | 'blue' | 'yellow' | 'green' | 'red' | 'gray';
  description?: string;
}

export default function StatCard({
  label,
  value,
  icon,
  colorClass,
  description,
}: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[colorClass]}`}>
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
        {description && (
          <div className={styles.description}>{description}</div>
        )}
      </div>
    </div>
  );
}
