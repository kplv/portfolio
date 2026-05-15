import { getAccentTextStyle } from '@/data/projects';
import styles from './info-table.module.css';

export interface InfoTableProps {
  role: string;
  year: string;
  contribution: string;
  accent?: string;
  /** Overrides the default “Role” column header */
  roleLabel?: string;
  /** Overrides the default “Year” column header */
  yearLabel?: string;
  /** Overrides the default “Scope” column header */
  contributionLabel?: string;
}

export function InfoTable({
  role,
  year,
  contribution,
  accent,
  roleLabel = 'Role',
  yearLabel = 'Year',
  contributionLabel = 'Scope',
}: InfoTableProps) {
  const headerStyle = accent ? getAccentTextStyle(accent) : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <p className={styles.header} style={headerStyle}>{roleLabel}</p>
        <p className={styles.text}>{role}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.header} style={headerStyle}>{yearLabel}</p>
        <p className={[styles.text, styles.yearValue].join(' ')}>{year}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.header} style={headerStyle}>{contributionLabel}</p>
        <p className={styles.text}>{contribution}</p>
      </div>
    </div>
  );
}
