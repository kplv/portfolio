'use client';

<<<<<<< HEAD
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Button } from '@/components/button';
=======
import { useEffect, useCallback, useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { AboutSectionContent } from '@/components/about-client/about-client';
>>>>>>> about-page
import { IntroText } from '@/components/intro-text';
import { NavigationHeader } from '@/components/navigation-header';
import { ProjectDetail } from '@/components/project-detail';
import { ProjectList } from '@/components/project-list';
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
<<<<<<< HEAD
import { ProjectModal } from '@/components/project-modal';
import { EASE_OUT_QUINT, ENTRANCE_CONTAINER, BLUR_ITEM } from '@/config/animations';
import { getAccentColor, type Project } from '@/data/projects';
import styles from './home-client.module.css';

const DEFAULT_TITLE = 'Denis Kopylov — Product Designer';
=======
import {
  ABOUT_PRESENCE_BRIDGE,
  HOME_SECTION_FADE,
  ROUTE_SECTION_REDUCED_MOTION_TARGET,
  ROUTE_SHELL_ANIMATE_PRESENCE_PROPS,
} from '@/config/page-motion';
import { getProjectByPathname, type Project } from '@/data/projects';
import styles from './home-client.module.css';

const DEFAULT_TITLE = 'Denis Kopylov — Product Designer';
const ABOUT_TITLE = 'About — Denis Kopylov';
>>>>>>> about-page

export interface HomeClientProps {
  projects: Project[];
  /** Page-level layout class from page.module.css applied to the main element */
  className?: string;
}

const MotionIntroText = motion(IntroText);
const MotionSocialLinkList = motion(SocialLinkList);
const MotionProjectList = motion(ProjectList);

export function HomeClient({ projects, className }: HomeClientProps) {
  const shouldReduceMotion = useReducedMotion();
<<<<<<< HEAD
  const didPushRef = useRef(false);
=======
  const pathname = usePathname();
  const isAbout = pathname === '/about';
  const isHome = pathname === '/';

  const projectFromRoute = useMemo(
    () => getProjectByPathname(pathname, projects),
    [pathname, projects],
  );
  const isProject = projectFromRoute != null;

  const showNavPadding = isHome || isAbout || isProject;

  const router = useRouter();
>>>>>>> about-page

  const handleOpenProject = useCallback(
    (project: Project) => {
      router.push(`/${project.slug}`);
    },
    [router],
  );

  const handleCloseProject = useCallback(() => {
    router.replace('/');
  }, [router]);

  useEffect(() => {
    if (projectFromRoute) {
      document.title = `${projectFromRoute.name} — Denis Kopylov`;
    } else if (isAbout) {
      document.title = ABOUT_TITLE;
    } else {
      document.title = DEFAULT_TITLE;
    }
  }, [projectFromRoute, isAbout]);

  const mainClassName = [className, showNavPadding ? styles.contentPadNav : null]
    .filter(Boolean)
    .join(' ');
  const reducedState = ROUTE_SECTION_REDUCED_MOTION_TARGET;

  return (
    <div className={styles.root}>
<<<<<<< HEAD
      <div className={styles.blurContext}>
        {/* Accent color overlay — always mounted, fades in/out based on open project */}
        <motion.div
          className={styles.overlay}
          style={
            openProject?.accentGradient
              ? { backgroundImage: openProject.accentGradient }
              : { backgroundColor: openProject ? getAccentColor(openProject) : 'var(--mint-400)' }
          }
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
                text="I'm a product designer by day and an engineer by night. I bring ideas to life in code, sweat over details, and chase joyful experiences. A mentor and design leader — now leading design at Ostrom."
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
=======
      <NavigationHeader />

      <main className={mainClassName}>
        <div className={styles.content}>
          <AnimatePresence {...ROUTE_SHELL_ANIMATE_PRESENCE_PROPS}>
            {isAbout ? (
              <motion.div
                key="about"
                style={{ display: 'contents' }}
                variants={ABOUT_PRESENCE_BRIDGE}
                initial="show"
                animate="show"
                exit="exit"
              >
                <AboutSectionContent />
              </motion.div>
            ) : projectFromRoute ? (
              <motion.div
                key={`project-${projectFromRoute.slug}`}
                style={{ display: 'contents' }}
              >
                <ProjectDetail
                  project={projectFromRoute}
                  onDismiss={handleCloseProject}
                />
              </motion.div>
            ) : (
              <motion.div key="home" style={{ display: 'contents' }}>
                <MotionIntroText
                  variants={HOME_SECTION_FADE}
                  custom={{ enterOrder: 0, exitOrder: 2 }}
                  initial={shouldReduceMotion ? reducedState : 'hidden'}
                  animate={shouldReduceMotion ? reducedState : 'show'}
                  exit={shouldReduceMotion ? reducedState : 'exit'}
                  header="Denis Kopylov"
                  text="Product designer with a focus on turning ideas into reality through coding, a holistic approach, and an eye for interactive experiences. Currently at Ostrom."
                />
                <MotionSocialLinkList
                  variants={HOME_SECTION_FADE}
                  custom={{ enterOrder: 1, exitOrder: 1 }}
                  initial={shouldReduceMotion ? reducedState : 'hidden'}
                  animate={shouldReduceMotion ? reducedState : 'show'}
                  exit={shouldReduceMotion ? reducedState : 'exit'}
                >
                  <SocialLink href="https://www.linkedin.com/in/deniskplv/" text="LinkedIn" />
                  <SocialLink href="https://www.are.na/denis-kopylov/channels" text="Are.na" />
                  <SocialLink href="/about" text="About" />
                </MotionSocialLinkList>
                <MotionProjectList
                  variants={HOME_SECTION_FADE}
                  custom={{ enterOrder: 2, exitOrder: 0 }}
                  initial={shouldReduceMotion ? reducedState : 'hidden'}
                  animate={shouldReduceMotion ? reducedState : 'show'}
                  exit={shouldReduceMotion ? reducedState : 'exit'}
                  projects={projects}
                  onProjectClick={handleOpenProject}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
>>>>>>> about-page
    </div>
  );
}
