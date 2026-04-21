import type { HTMLMotionProps } from 'motion/react';
import styles from './social-link-list.module.css';

export interface SocialLinkListProps extends Omit<HTMLMotionProps<'nav'>, 'children'> {
  children: React.ReactNode;
}

export function SocialLinkList({
  children,
  className,
  ...motionProps
}: SocialLinkListProps) {
  return (
    <nav
      {...motionProps}
      className={[styles.list, className].filter(Boolean).join(' ')}
      aria-label="Social links"
    >
      {children}
    </nav>
  );
}
