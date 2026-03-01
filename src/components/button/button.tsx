'use client';

import { motion, useReducedMotion } from 'motion/react';
import {
  EASE_OUT_QUINT,
  PRESS_DURATION,
  PRESS_SCALE,
} from '@/config/animations';
import styles from './button.module.css';

export interface ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  ghost?: boolean;
}

export function Button({ label, icon, ghost }: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const iconOnly = icon && !label;

  return (
    <motion.button
      type="button"
      className={[styles.button, ghost && styles.ghost, iconOnly && styles.iconOnly]
        .filter(Boolean)
        .join(' ')}
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: PRESS_SCALE,
              transition: {
                duration: PRESS_DURATION,
                ease: EASE_OUT_QUINT,
              },
            }
      }
    >
      {icon && <div className={styles.iconWrapper}>{icon}</div>}
      {label && <p className={styles.label}>{label}</p>}
    </motion.button>
  );
}
