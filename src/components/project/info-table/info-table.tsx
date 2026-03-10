import styles from './info-table.module.css';

export interface InfoTableProps {
  role: string;
  year: string;
  contribution: string;
  color?: string;
}

export function InfoTable({ role, year, contribution, color }: InfoTableProps) {
  const headerStyle = color ? { color } : undefined;

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <p className={styles.header} style={headerStyle}>Role</p>
        <p className={styles.text} style={headerStyle}>{role}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.header} style={headerStyle}>When</p>
        <p className={styles.text} style={headerStyle}>{year}</p>
      </div>
      <div className={styles.item}>
        <p className={styles.header} style={headerStyle}>What</p>
        <p className={styles.text} style={headerStyle}>{contribution}</p>
      </div>
    </div>
  );
}
