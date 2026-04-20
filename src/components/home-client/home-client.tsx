'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { AboutSectionContent } from '@/components/about-client/about-client';
import { IntroText } from '@/components/intro-text';
import {
  NavigationHeader,
  type NavigationHeaderState,
} from '@/components/navigation-header';
import { ProjectList } from '@/components/project-list';
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { ProjectModal } from '@/components/project-modal';
import { UnicornBackground } from '@/components/unicorn-background';
import { type Project } from '@/data/projects';
import styles from './home-client.module.css';

const DEFAULT_TITLE = 'Denis Kopylov — Product Designer';
const ABOUT_TITLE = 'About — Denis Kopylov';

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

const IS_DEV = process.env.NODE_ENV !== 'production';

export function HomeClient({ projects, className, initialProjectSlug }: HomeClientProps) {
  const pathname = usePathname();
  const isAbout = pathname === '/about';
  const isHome = pathname === '/';
  const showNavHeader = isHome || isAbout;

  const [presentedProject, setPresentedProject] = useState<Project | null>(() =>
    getInitialPresentedProject(projects, initialProjectSlug),
  );

  /** Dev-only: on `/`, cycle left Go Back on/off (theme toggle always stays on the right) */
  const [devNavOverride, setDevNavOverride] =
    useState<NavigationHeaderState>('theme');

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

  const mainClassName = [
    className,
    showNavHeader ? styles.contentPadNav : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.root}>
      <NavigationHeader
        devStateOverride={IS_DEV && isHome ? devNavOverride : undefined}
      />

      <main className={mainClassName}>
        <div className={styles.content}>
          {isAbout ? (
            <AboutSectionContent />
          ) : (
            <>
              {IS_DEV && isHome && (
                <button
                  type="button"
                  className={styles.devNavCycle}
                  onClick={() =>
                    setDevNavOverride((prev) =>
                      prev === 'theme' ? 'back' : 'theme',
                    )
                  }
                >
                  {`[dev] Left back: ${devNavOverride === 'back' ? 'on' : 'off'} — click to toggle; theme stays on the right`}
                </button>
              )}
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
