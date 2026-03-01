'use client';

import { motion, useReducedMotion } from 'motion/react';
import {
  EASE_OUT_QUINT,
  PRESS_DURATION,
  PRESS_SCALE,
} from '@/config/animations';
import styles from './button.module.css';

export interface ButtonProps {
  label: string;
  icon?: React.ReactNode;
}

export function Button({ label, icon }: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.button
      type="button"
      className={styles.button}
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
      {icon && <span className={styles.iconWrapper}>{icon}</span>}
      <span>{label}</span>
    </motion.button>
  );
}
