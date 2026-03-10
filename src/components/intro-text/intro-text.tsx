'use client';

import styles from './intro-text.module.css';

export interface IntroTextProps {
  header: string;
  text: string;
  /** Solid accent color for header when no gradient */
  color?: string;
  /** Gradient for header; takes precedence over color when provided */
  gradient?: string;
}

export function IntroText({ header, text, color, gradient }: IntroTextProps) {
  const headerStyle: React.CSSProperties | undefined =
    gradient
      ? {
          backgroundImage: gradient,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }
      : color
        ? { color }
        : undefined;

  return (
    <div className={styles.container}>
      <h1 className={styles.header} {...(headerStyle && { style: headerStyle })}>
        {header}
      </h1>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
