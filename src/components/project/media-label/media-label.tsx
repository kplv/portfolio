'use client';

import type { CSSProperties } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  PRESS_SCALE,
  SPRING_PRESS,
} from '@/config/animations';
import styles from './media-label.module.css';

export interface MediaLabelProps {
  label?: string;
  color: string;
  onPrev?: () => void;
  onNext?: () => void;
  current?: number;
  total?: number;
}

export function MediaLabel({
  label,
  color,
  onPrev,
  onNext,
  current,
  total,
}: MediaLabelProps) {
  const shouldReduceMotion = useReducedMotion();

  const showPill = onPrev != null && onNext != null;
  const showCounter = current != null && total != null;
  const showControls = showPill || showCounter;

  const tap =
    shouldReduceMotion || !showPill
      ? undefined
      : {
          scale: PRESS_SCALE,
          opacity: 0.7,
          transition: SPRING_PRESS,
        };

  return (
    <div
      className={styles.container}
      style={{ '--media-label-accent': color } as CSSProperties}
    >
      {showControls ? (
        <div className={styles.controlContainer}>
          {showPill ? (
            <div className={styles.buttonContainer}>
              <motion.button
                type="button"
                className={styles.arrowButton}
                onClick={onPrev}
                aria-label="Previous image"
                whileTap={tap}
              >
                <span
                  className={[styles.arrow, styles.arrowPrev].join(' ')}
                  aria-hidden
                />
              </motion.button>
              <motion.button
                type="button"
                className={styles.arrowButton}
                onClick={onNext}
                aria-label="Next image"
                whileTap={tap}
              >
                <span className={styles.arrow} aria-hidden />
              </motion.button>
            </div>
          ) : null}
          {showCounter ? (
            <div className={styles.counterContainer}>
              <span className={styles.counterIcon} aria-hidden />
              <span className={styles.srOnly}>
                Image {current} of {total}
              </span>
              <span className={styles.counterText} aria-hidden>
                {current}
                <span className={styles.counterDim}> / {total}</span>
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      {label ? <p className={styles.label}>{label}</p> : null}
    </div>
  );
}
