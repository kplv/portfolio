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
}

export function IntroText({
  header,
  text,
  accent,
  italicHeader = false,
  className,
  ...motionProps
}: IntroTextProps) {
  const headerStyle =
    accent ? getAccentTextStyle(accent) : undefined;

  return (
    <motion.div
      {...motionProps}
      className={[styles.container, className].filter(Boolean).join(' ')}
    >
      <h1
        className={[
          styles.header,
          italicHeader ? styles.headerItalic : null,
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
