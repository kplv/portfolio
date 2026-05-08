'use client';

import { useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/button';
import { useMotionTokens } from '@/config/motion-tokens';
import { getProjectByPathname, projects } from '@/data/projects';
import { BackButton } from './back-button';
import styles from './navigation-header.module.css';

export type NavigationHeaderState = 'theme' | 'back';

export function NavigationHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const tokens = useMotionTokens();

  const isProjectRoute =
    getProjectByPathname(pathname, projects) != null;

  const isVisible =
    pathname === '/' || pathname === '/about' || isProjectRoute;

  const routeState: NavigationHeaderState =
    pathname === '/about' || isProjectRoute ? 'back' : 'theme';

  const showBack = routeState === 'back';
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
        transition={shouldReduceMotion ? { duration: 0 } : tokens.nav.shellSpring}
      >
        <div className={styles.leftSlot}>
          <AnimatePresence initial={false}>
            {showBack && <BackButton key="nav-back" onClick={handleNavigateHome} />}
          </AnimatePresence>
        </div>
        <div className={styles.rightSlot}>
          {showThemeToggle && <Button themeSwitch />}
        </div>
      </motion.div>
    </div>
  );
}
