'use client';

import type { CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { SPRING_ICON_SWAP, SPRING_PRESS } from '@/config/animations';
import {
  getAccentSolid,
  getAccentTextStyle,
  isCssGradient,
} from '@/data/projects';
import styles from './media-label.module.css';

const arrowButtonVariants = {
  rest: {},
  pressed: {},
} as const;

const arrowPrevVariants = {
  rest: { x: 0, transition: SPRING_PRESS },
  pressed: { x: 3, transition: SPRING_PRESS },
} as const;

const arrowNextVariants = {
  rest: { x: 0, transition: SPRING_PRESS },
  pressed: { x: 3, transition: SPRING_PRESS },
} as const;

export interface MediaLabelProps {
  label?: string;
  /** Resolved project accent (CSS solid, gradient, or display token). */
  accent: string;
  onPrev?: () => void;
  onNext?: () => void;
  current?: number;
  total?: number;
}

export function MediaLabel({
  label,
  accent,
  onPrev,
  onNext,
  current,
  total,
}: MediaLabelProps) {
  const shouldReduceMotion = useReducedMotion();
  const accentSolid = getAccentSolid(accent);
  /** Gradient + `background-clip: text` is unreliable for small UI type; use derived solid. */
  const counterTextStyle: CSSProperties = isCssGradient(accent)
    ? { color: accentSolid }
    : getAccentTextStyle(accent);

  const showPill = onPrev != null && onNext != null;
  const showCounter = current != null && total != null;
  const showControls = showPill || showCounter;

  const tapVariant =
    shouldReduceMotion || !showPill ? undefined : ('pressed' as const);

  return (
    <div
      className={styles.container}
      style={
        {
          '--media-label-fill': accent,
          '--media-label-solid': accentSolid,
        } as CSSProperties
      }
    >
      {showControls ? (
        <div className={styles.controlContainer}>
          {showPill ? (
            <div className={styles.buttonContainer}>
              <motion.button
                type="button"
                className={[styles.arrowButton, styles.arrowButtonPrev].join(' ')}
                onClick={onPrev}
                aria-label="Previous image"
                variants={arrowButtonVariants}
                initial="rest"
                animate="rest"
                whileTap={tapVariant}
              >
                <span className={styles.arrowFlip} aria-hidden>
                  <motion.span className={styles.arrow} variants={arrowPrevVariants} aria-hidden />
                </span>
              </motion.button>
              <motion.button
                type="button"
                className={[styles.arrowButton, styles.arrowButtonNext].join(' ')}
                onClick={onNext}
                aria-label="Next image"
                variants={arrowButtonVariants}
                initial="rest"
                animate="rest"
                whileTap={tapVariant}
              >
                <motion.span className={styles.arrow} variants={arrowNextVariants} aria-hidden />
              </motion.button>
            </div>
          ) : null}
          {showCounter ? (
            <div className={styles.counterContainer}>
              <span className={styles.counterIcon} aria-hidden />
              <span className={styles.srOnly}>
                Image {current} of {total}
              </span>
              <span
                className={styles.counterText}
                style={counterTextStyle}
                aria-hidden
              >
                {current}
                <span className={styles.counterDim}> / {total}</span>
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
      <AnimatePresence initial={false} mode="popLayout">
        {label ? (
          <motion.p
            key={label}
            layout
            className={styles.label}
            initial={
              shouldReduceMotion ? false : { opacity: 0, filter: 'blur(8px)' }
            }
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { opacity: 0, filter: 'blur(8px)' }
            }
            transition={SPRING_ICON_SWAP}
          >
            {label}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
