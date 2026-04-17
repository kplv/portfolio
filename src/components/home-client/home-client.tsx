'use client';

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Button } from '@/components/button';
import { IntroText } from '@/components/intro-text';
import { ProjectList } from '@/components/project-list';
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { ProjectModal } from '@/components/project-modal';
import { UnicornBackground } from '@/components/unicorn-background';
import { EASE_OUT_QUINT, ENTRANCE_CONTAINER, BLUR_ITEM } from '@/config/animations';
import { type Project } from '@/data/projects';
import styles from './home-client.module.css';

const DEFAULT_TITLE = 'Denis Kopylov — Product Designer';

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
  const [presentedProject, setPresentedProject] = useState<Project | null>(() =>
    getInitialPresentedProject(projects, initialProjectSlug),
  );

  const skipModalPresenceEnterRef = useRef<boolean | null>(null);
  if (skipModalPresenceEnterRef.current === null) {
    if (!initialProjectSlug) {
      skipModalPresenceEnterRef.current = true;
    } else if (typeof window === 'undefined') {
      skipModalPresenceEnterRef.current = true;
    } else if (
      pendingModalChoreographySlug === initialProjectSlug &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      skipModalPresenceEnterRef.current = false;
    } else {
      skipModalPresenceEnterRef.current = true;
    }
  }

  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';

  useLayoutEffect(() => {
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

    setPresentedProject(null);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPresentedProject(p);
        pendingModalChoreographySlug = null;
      });
    });
    return () => cancelAnimationFrame(id);
  }, [initialProjectSlug, projects, shouldReduceMotion]);

  const handleOpenProject = useCallback((project: Project) => {
    pendingModalChoreographySlug = project.slug;
    router.push(`/${project.slug}`);
  }, [router]);

  const handleCloseProject = useCallback(() => {
    pendingModalChoreographySlug = null;
    router.replace('/');
  }, [router]);

  useEffect(() => {
    document.title = presentedProject
      ? `${presentedProject.name} — Denis Kopylov`
      : DEFAULT_TITLE;
  }, [presentedProject]);

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

  return (
    <div className={styles.root}>
      <div className={styles.blurContext}>
        {/* Main page — recedes back iOS-style when modal opens */}
        <motion.main
          className={className}
          style={
            {
              borderRadius: 16,
              willChange: presentedProject ? 'auto' : 'transform',
              pointerEvents: presentedProject ? 'none' : 'auto',
            } as React.CSSProperties
          }
          animate={
            shouldReduceMotion
              ? { opacity: presentedProject ? 0.7 : 1, filter: 'blur(0px)' }
              : {
                  scale: presentedProject ? 0.92 : 1,
                  y: presentedProject ? -16 : 0,
                  opacity: presentedProject ? 0.1 : 1,
                  filter: presentedProject ? 'blur(8px)' : 'blur(0px)',
                }
          }
          transition={{ duration: 0.3, ease: EASE_OUT_QUINT }}
        >
          <motion.div
            className={styles.entranceContainer}
            variants={ENTRANCE_CONTAINER}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
          >
            <motion.div className={styles.toolbar} variants={BLUR_ITEM}>
              <Button themeSwitch />
            </motion.div>
            <motion.div variants={BLUR_ITEM}>
              <IntroText
                header="Denis Kopylov"
                text="Product designer with a focus on turning ideas into reality through coding, a holistic approach, and an eye for interactive experiences. Currently at Ostrom."
              />
            </motion.div>
            <motion.div variants={BLUR_ITEM}>
              <SocialLinkList>
                <SocialLink href="https://www.linkedin.com/in/deniskplv/" text="LinkedIn" />
                <SocialLink href="https://www.are.na/denis-kopylov/channels" text="Are.na" />
                <SocialLink href="/about" text="About" />
              </SocialLinkList>
            </motion.div>
            <motion.div variants={BLUR_ITEM}>
              <ProjectList projects={projects} onProjectClick={handleOpenProject} />
            </motion.div>
          </motion.div>
        </motion.main>
      </div>

      {/* Project modal — slides up from bottom */}
      <AnimatePresence initial={!skipModalPresenceEnterRef.current}>
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
