'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useMotionTokens } from '@/config/motion-tokens';
import styles from './navigation-header.module.css';

export interface BackButtonProps {
  onClick: () => void;
  /** When true (default), enables enter/exit transition props for use inside AnimatePresence. */
  presence?: boolean;
}

export function BackButton({ onClick, presence = true }: BackButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const tokens = useMotionTokens();

  return (
    <motion.button
      key="nav-back"
      type="button"
      className={styles.goBack}
      onClick={onClick}
      aria-label="Go back to home"
      initial={
        presence && !shouldReduceMotion ? { opacity: 0, scale: 0.92 } : false
      }
      animate={{ opacity: 1, scale: 1 }}
      exit={
        presence && !shouldReduceMotion
          ? { opacity: 0, scale: 0.92 }
          : undefined
      }
      transition={
        shouldReduceMotion ? { duration: 0 } : tokens.nav.actionTransition
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: tokens.interactiveTap.scale,
              transition: tokens.interactiveTap.spring,
            }
      }
    >
      <span className={styles.goBackIcon} aria-hidden />
      <span className={styles.goBackLabel}>Go Back</span>
    </motion.button>
  );
}
