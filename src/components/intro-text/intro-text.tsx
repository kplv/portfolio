'use client';

import type { HTMLMotionProps } from 'motion/react';
import styles from './intro-text.module.css';

export interface IntroTextProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  header: string;
  text: string;
  /** Solid accent color for header when no gradient */
  color?: string;
  /** Gradient for header; takes precedence over color when provided */
  gradient?: string;
}

export function IntroText({
  header,
  text,
  color,
  gradient,
  className,
  ...motionProps
}: IntroTextProps) {
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
    <div
      {...motionProps}
      className={[styles.container, className].filter(Boolean).join(' ')}
    >
      <h1 className={styles.header} {...(headerStyle && { style: headerStyle })}>
        {header}
      </h1>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
