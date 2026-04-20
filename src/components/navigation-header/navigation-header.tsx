'use client';

import { useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import {
  EASE_OUT_QUINT,
  PRESS_DURATION,
  PRESS_SCALE,
  SPRING_ICON_SWAP,
} from '@/config/animations';
import { getProjectByPathname, projects } from '@/data/projects';
import styles from './navigation-header.module.css';

export type NavigationHeaderState = 'theme' | 'back';

export interface NavigationHeaderProps {
  /**
   * When pathname is `/` and this is set (dev preview), toggles Go Back on `/` (left side).
   * Theme toggle stays on the right; both can show when back is on.
   */
  devStateOverride?: NavigationHeaderState;
}

const actionSwapTransition = {
  duration: 0.2,
  ease: EASE_OUT_QUINT as [number, number, number, number],
};

export function NavigationHeader({ devStateOverride }: NavigationHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  const isProjectRoute =
    getProjectByPathname(pathname, projects) != null;

  const isVisible =
    pathname === '/' || pathname === '/about' || isProjectRoute;

  const routeState: NavigationHeaderState =
    pathname === '/about' || isProjectRoute ? 'back' : 'theme';

  const effectiveState: NavigationHeaderState = useMemo(() => {
    if (pathname === '/' && devStateOverride != null) {
      return devStateOverride;
    }
    return routeState;
  }, [pathname, routeState, devStateOverride]);

  const showBack = effectiveState === 'back';
  const isAbout = pathname === '/about';
  const showThemeToggle = !isAbout && !isProjectRoute;

  const handleNavigateHome = useCallback(() => {
    router.push('/');
  }, [router]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.fixed} data-navigation-header>
      <motion.div
        className={`${styles.inner} ${styles.row}`}
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={shouldReduceMotion ? { duration: 0 } : { ...SPRING_ICON_SWAP }}
      >
        <div className={styles.leftSlot}>
          <AnimatePresence initial={false}>
            {showBack && (
              <motion.button
                key="nav-back"
                type="button"
                className={styles.goBack}
                onClick={handleNavigateHome}
                aria-label="Go back to home"
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.92 }
                }
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  shouldReduceMotion ? undefined : { opacity: 0, scale: 0.92 }
                }
                transition={shouldReduceMotion ? { duration: 0 } : actionSwapTransition}
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
                <span className={styles.goBackIcon} aria-hidden />
                <span className={styles.goBackLabel}>Go Back</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
        <div className={styles.rightSlot}>
          {showThemeToggle && <Button themeSwitch />}
        </div>
      </motion.div>
    </div>
  );
}
