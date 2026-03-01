import styles from './social-link-list.module.css';

export interface SocialLinkListProps {
  children: React.ReactNode;
}

export function SocialLinkList({ children }: SocialLinkListProps) {
  return (
    <nav className={styles.list} aria-label="Social links">
      {children}
    </nav>
  );
}
