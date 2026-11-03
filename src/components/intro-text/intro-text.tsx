'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { getAccentTextStyle } from '@/data/projects';
import styles from './intro-text.module.css';

export interface IntroTextProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  header: string;
  text: string;
  /** Unified accent: CSS color, gradient, or tokens such as `var(--text-display-gradient)`. */
  accent?: string;
  /** When true, uses the designed italic Hagrid face (home hero only). */
  italicHeader?: boolean;
  /** When true, the header uses the same type style as the body text (ignores `accent`). */
  plainHeader?: boolean;
}

export function IntroText({
  header,
  text,
  accent,
  italicHeader = false,
  plainHeader = false,
  className,
  ...motionProps
}: IntroTextProps) {
  const headerStyle =
    accent && !plainHeader ? getAccentTextStyle(accent) : undefined;

  return (
    <motion.div
      {...motionProps}
      className={[styles.container, className].filter(Boolean).join(' ')}
    >
      <h1
        className={[
          plainHeader ? `${styles.text} ${styles.headerPlain}` : styles.header,
          italicHeader && !plainHeader ? styles.headerItalic : null,
        ]
          .filter(Boolean)
          .join(' ')}
        {...(headerStyle && { style: headerStyle })}
      >
        {header}
      </h1>
      <p className={styles.text}>{text}</p>
    </motion.div>
  );
}
