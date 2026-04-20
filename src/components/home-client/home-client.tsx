'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { AboutSectionContent } from '@/components/about-client/about-client';
import { Button } from '@/components/button';
import { IntroText } from '@/components/intro-text';
import { ProjectList } from '@/components/project-list';
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { ProjectModal } from '@/components/project-modal';
import { UnicornBackground } from '@/components/unicorn-background';
import {
  EASE_OUT_QUINT,
  PRESS_DURATION,
  PRESS_SCALE,
} from '@/config/animations';
import { type Project } from '@/data/projects';
import styles from './home-client.module.css';

const DEFAULT_TITLE = 'Denis Kopylov — Product Designer';
const ABOUT_TITLE = 'About — Denis Kopylov';
const TOOLBAR_REVEAL_SESSION_KEY = 'home-toolbar-reveal-shown';

/**
 * Survives React Strict Mode remounts (unlike sessionStorage consumed in effects).
 * Set right before router.push from `/`; cleared after choreographed reveal or on close.
 */
let pendingModalChoreographySlug: string | null = null;

function resolveProject(
  projects: Project[],
  slug: string | undefined,
): Project | null {
  if (slug == null) return null;
  return projects.find((p) => p.slug === slug) ?? null;
}

function getInitialPresentedProject(
  projects: Project[],
  initialProjectSlug: string | undefined,
): Project | null {
  const resolved = resolveProject(projects, initialProjectSlug);
  if (!resolved) return null;
  if (typeof window === 'undefined') return resolved;
  if (
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches
  ) {
    return resolved;
  }
  if (pendingModalChoreographySlug === resolved.slug) {
    return null;
  }
  return resolved;
}

export interface HomeClientProps {
  projects: Project[];
  /** Page-level layout class from page.module.css applied to the main element */
  className?: string;
  /** When set, auto-open this project on mount (used by /[slug] route) */
  initialProjectSlug?: string;
}

export function HomeClient({ projects, className, initialProjectSlug }: HomeClientProps) {
  const pathname = usePathname();
  const isAbout = pathname === '/about';

  const [presentedProject, setPresentedProject] = useState<Project | null>(() =>
    getInitialPresentedProject(projects, initialProjectSlug),
  );

  const [toolbarRevealState, setToolbarRevealState] = useState<'idle' | 'showing'>('idle');
  const skipModalPresenceEnter = useMemo(() => {
    if (!initialProjectSlug) {
      return true;
    }
    if (typeof window === 'undefined') {
      return true;
    }
    return !(
      pendingModalChoreographySlug === initialProjectSlug &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, [initialProjectSlug]);

  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';

  useEffect(() => {
    if (typeof window === 'undefined' || shouldReduceMotion) return;
    if (window.sessionStorage.getItem(TOOLBAR_REVEAL_SESSION_KEY) === '1') return;

    const frameId = requestAnimationFrame(() => {
      window.sessionStorage.setItem(TOOLBAR_REVEAL_SESSION_KEY, '1');
      setToolbarRevealState('showing');
    });

    return () => cancelAnimationFrame(frameId);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!initialProjectSlug || typeof window === 'undefined') return;

    if (shouldReduceMotion) {
      pendingModalChoreographySlug = null;
      return;
    }

    if (pendingModalChoreographySlug !== initialProjectSlug) {
      return;
    }

    const p = resolveProject(projects, initialProjectSlug);
    if (!p) return;

    let revealId = 0;
    const hideId = requestAnimationFrame(() => {
      setPresentedProject(null);
      revealId = requestAnimationFrame(() => {
        setPresentedProject(p);
        pendingModalChoreographySlug = null;
      });
    });
    return () => {
      cancelAnimationFrame(hideId);
      cancelAnimationFrame(revealId);
    };
  }, [initialProjectSlug, projects, shouldReduceMotion]);

  const handleOpenProject = useCallback(
    (project: Project) => {
      pendingModalChoreographySlug = project.slug;
      router.push(`/${project.slug}`);
    },
    [router],
  );

  const handleCloseProject = useCallback(() => {
    pendingModalChoreographySlug = null;
    router.replace('/');
  }, [router]);

  const handleNavigateHome = useCallback(() => {
    router.push('/');
  }, [router]);

  useEffect(() => {
    if (presentedProject) {
      document.title = `${presentedProject.name} — Denis Kopylov`;
    } else if (isAbout) {
      document.title = ABOUT_TITLE;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [presentedProject, isAbout]);

  useEffect(() => {
    if (presentedProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [presentedProject]);

  const actionSwapTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: EASE_OUT_QUINT as [number, number, number, number] };

  return (
    <div className={styles.root}>
      <main className={className}>
        <motion.div
          key={toolbarRevealState}
          className={`${styles.toolbar} ${isAbout ? styles.toolbarAbout : styles.toolbarHome}`}
          initial={
            toolbarRevealState === 'showing' && !shouldReduceMotion
              ? { opacity: 0 }
              : false
          }
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, ease: EASE_OUT_QUINT }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isAbout ? 'about-toolbar' : 'home-toolbar'}
              initial={
                shouldReduceMotion
                  ? false
                  : { opacity: 0, scale: 0.92, filter: 'blur(8px)' }
              }
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={
                shouldReduceMotion
                  ? undefined
                  : { opacity: 0, scale: 0.92, filter: 'blur(8px)' }
              }
              transition={actionSwapTransition}
            >
              {isAbout ? (
                <motion.button
                  type="button"
                  className={styles.goBack}
                  onClick={handleNavigateHome}
                  aria-label="Go back to home"
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
              ) : (
                <Button themeSwitch />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className={styles.content}>
          {isAbout ? (
            <AboutSectionContent />
          ) : (
            <>
              <IntroText
                header="Denis Kopylov"
                text="Product designer with a focus on turning ideas into reality through coding, a holistic approach, and an eye for interactive experiences. Currently at Ostrom."
              />
              <SocialLinkList>
                <SocialLink href="https://www.linkedin.com/in/deniskplv/" text="LinkedIn" />
                <SocialLink href="https://www.are.na/denis-kopylov/channels" text="Are.na" />
                <SocialLink href="/about" text="About" />
              </SocialLinkList>
              <ProjectList projects={projects} onProjectClick={handleOpenProject} />
            </>
          )}
        </div>
      </main>

      {/* Project modal — slides up from bottom */}
      <AnimatePresence initial={!skipModalPresenceEnter}>
        {presentedProject && (
          <ProjectModal
            key={presentedProject.id}
            project={presentedProject}
            onClose={handleCloseProject}
          />
        )}
      </AnimatePresence>
      {!shouldReduceMotion && (
        <UnicornBackground paused={!!presentedProject} isVisible={isLightTheme} />
      )}
    </div>
  );
}
