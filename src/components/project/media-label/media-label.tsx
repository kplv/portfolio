import styles from './media-label.module.css';

export interface MediaLabelProps {
  label: string;
  color: string;
}

export function MediaLabel({ label, color }: MediaLabelProps) {
  return (
    <div className={styles.container}>
      <p className={styles.label}>{label}</p>
    </div>
  );
}