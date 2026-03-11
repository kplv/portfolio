'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useTheme } from 'next-themes';
import {
  EASE_OUT_QUINT,
  PRESS_DURATION,
  PRESS_SCALE,
  SPRING_ICON_SWAP,
} from '@/config/animations';
import styles from './button.module.css';

export interface ButtonProps {
  label?: string;
  icon?: React.ReactNode;
  themeSwitch?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  hitSlop?: 'default' | 'info';
}

export function Button({ label, icon, themeSwitch, onClick, className, hitSlop = 'default' }: ButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isIconOnly = themeSwitch || (icon && !label);
  const isDark = resolvedTheme === 'dark';

  const handleClick = (e: React.MouseEvent) => {
    if (themeSwitch) {
      setTheme(isDark ? 'light' : 'dark');
    }
    onClick?.(e);
  };

  const themeIconSrc = mounted && isDark ? '/moon.svg' : '/sun.svg';

  return (
    <motion.button
      type="button"
      className={[
        styles.button,
        isIconOnly && styles.iconOnly,
        themeSwitch && styles.themeSwitch,
        hitSlop === 'info' && styles.hitSlopInfo,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={handleClick}
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
      {themeSwitch ? (
        <div className={styles.iconWrapper}>
          {mounted && (
            <AnimatePresence initial={false}>
              <motion.div
                key={resolvedTheme}
                className={styles.themeIcon}
                style={{
                  WebkitMaskImage: `url('${themeIconSrc}')`,
                  maskImage: `url('${themeIconSrc}')`,
                }}
                initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.6, filter: 'blur(8px)' }}
                transition={SPRING_ICON_SWAP}
              />
            </AnimatePresence>
          )}
        </div>
      ) : (
        <>
          {icon && <div className={styles.iconWrapper}>{icon}</div>}
          {label && <p className={styles.label}>{label}</p>}
        </>
      )}
    </motion.button>
  );
}
