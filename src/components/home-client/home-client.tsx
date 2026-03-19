'use client';

import { useState, useEffect, useRef, useCallback, type CSSProperties } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from '@/components/button';
import { IntroText } from '@/components/intro-text';
import { ProjectList } from '@/components/project-list';
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { ProjectModal } from '@/components/project-modal';
import { UnicornBackground } from '@/components/unicorn-background';
import { EASE_OUT_QUINT, ENTRANCE_CONTAINER, BLUR_ITEM } from '@/config/animations';
import { getAccentColor, type Project } from '@/data/projects';
import styles from './home-client.module.css';

const DEFAULT_TITLE = 'Denis Kopylov — Product Designer';

function overlayStyleForProject(project: Project): CSSProperties {
  return project.accentGradient
    ? { backgroundImage: project.accentGradient }
    : { backgroundColor: getAccentColor(project) };
}

export interface HomeClientProps {
  projects: Project[];
  /** Page-level layout class from page.module.css applied to the main element */
  className?: string;
  /** When set, auto-open this project on mount (used by /[slug] route) */
  initialProjectSlug?: string;
}

export function HomeClient({ projects, className, initialProjectSlug }: HomeClientProps) {
  const [openProject, setOpenProject] = useState<Project | null>(() =>
    initialProjectSlug
      ? projects.find((p) => p.slug === initialProjectSlug) ?? null
      : null,
  );
  const shouldReduceMotion = useReducedMotion();
  const didPushRef = useRef(false);
  /** Last project overlay look — kept after close so fade-out doesn’t snap to mint */
  const overlayAppearanceRef = useRef<CSSProperties | null>(null);

  if (openProject) {
    overlayAppearanceRef.current = overlayStyleForProject(openProject);
  }

  const overlayStyle: CSSProperties = openProject
    ? overlayStyleForProject(openProject)
    : overlayAppearanceRef.current ?? { backgroundColor: 'var(--mint-400)' };

  const handleOpenProject = useCallback(
    (project: Project) => {
      setOpenProject(project);
      window.history.pushState(null, '', `/${project.slug}`);
      didPushRef.current = true;
    },
    [],
  );

  const handleCloseProject = useCallback(() => {
    setOpenProject(null);
    if (didPushRef.current) {
      window.history.back();
      didPushRef.current = false;
    } else {
      window.history.replaceState(null, '', '/');
    }
  }, []);

  useEffect(() => {
    const onPopState = () => {
      const slug = window.location.pathname.slice(1);
      const project = slug ? projects.find((p) => p.slug === slug) : null;
      setOpenProject(project ?? null);
      didPushRef.current = false;
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [projects]);

  useEffect(() => {
    document.title = openProject
      ? `${openProject.name} — Denis Kopylov`
      : DEFAULT_TITLE;
  }, [openProject]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (openProject) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [openProject]);

  return (
    <div className={styles.root}>

      <div className={styles.blurContext}>
        {/* Accent color overlay — always mounted, fades in/out based on open project */}
        <motion.div
          className={styles.overlay}
          style={overlayStyle}
          initial={{ opacity: 0 }}
          animate={{ opacity: openProject ? 0.7 : 0 }}
          transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
        />

        {/* Main page — recedes back iOS-style when modal opens */}
        <motion.main
          className={className}
          style={
            {
              borderRadius: 16,
              willChange: openProject ? 'auto' : 'transform',
              pointerEvents: openProject ? 'none' : 'auto',
            } as React.CSSProperties
          }
          animate={
            shouldReduceMotion
              ? { opacity: openProject ? 0.7 : 1, filter: 'blur(0px)' }
              : {
                scale: openProject ? 0.92 : 1,
                y: openProject ? -16 : 0,
                opacity: openProject ? 0.1 : 1,
                filter: openProject ? 'blur(8px)' : 'blur(0px)',
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
                <SocialLink href="/Denis Kopylov-CV.pdf" text="Resume" />
              </SocialLinkList>
            </motion.div>
            <motion.div variants={BLUR_ITEM}>
              <ProjectList projects={projects} onProjectClick={handleOpenProject} />
            </motion.div>
          </motion.div>

        </motion.main>

      </div>


      {/* Project modal — slides up from bottom */}
      <AnimatePresence initial={!initialProjectSlug}>
        {openProject && (
          <ProjectModal
            key={openProject.id}
            project={openProject}
            onClose={handleCloseProject}
          />
        )}
      </AnimatePresence>
      {!shouldReduceMotion && <UnicornBackground paused={!!openProject} />}
    </div>
  );
}
