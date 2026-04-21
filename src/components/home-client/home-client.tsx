'use client';

import { useEffect, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { usePathname, useRouter } from 'next/navigation';
import { AboutSectionContent } from '@/components/about-client/about-client';
import { IntroText } from '@/components/intro-text';
import {
  NavigationHeader,
  type NavigationHeaderState,
} from '@/components/navigation-header';
import { ProjectDetail } from '@/components/project-detail';
import { ProjectList } from '@/components/project-list';
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { HOME_SECTION_FADE } from '@/config/animations';
import { getProjectByPathname, type Project } from '@/data/projects';
import styles from './home-client.module.css';

const DEFAULT_TITLE = 'Denis Kopylov — Product Designer';
const ABOUT_TITLE = 'About — Denis Kopylov';

export interface HomeClientProps {
  projects: Project[];
  /** Page-level layout class from page.module.css applied to the main element */
  className?: string;
}

const IS_DEV = process.env.NODE_ENV !== 'production';
const ABOUT_PRESENCE_BRIDGE = {
  show: { opacity: 1 },
  exit: { opacity: 1, transition: { when: 'afterChildren' as const } },
};
const MotionIntroText = motion(IntroText);
const MotionSocialLinkList = motion(SocialLinkList);
const MotionProjectList = motion(ProjectList);

export function HomeClient({ projects, className }: HomeClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const pathname = usePathname();
  const isAbout = pathname === '/about';
  const isHome = pathname === '/';

  const projectFromRoute = useMemo(
    () => getProjectByPathname(pathname, projects),
    [pathname, projects],
  );
  const isProject = projectFromRoute != null;

  const showNavPadding = isHome || isAbout || isProject;

  /** Dev-only: on `/`, cycle left Go Back on/off (theme toggle stays on the right) */
  const [devNavOverride, setDevNavOverride] = useState<NavigationHeaderState>(
    'theme',
  );

  const router = useRouter();

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
  const reducedState = { opacity: 1 };

  return (
    <div className={styles.root}>
      <NavigationHeader
        devStateOverride={IS_DEV && isHome ? devNavOverride : undefined}
      />

      <main className={mainClassName}>
        <div className={styles.content}>
          <AnimatePresence
            mode="wait"
          >
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
    </div>
  );
}
