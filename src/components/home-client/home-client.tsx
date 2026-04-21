'use client';

import { useEffect, useCallback, useMemo, useState } from 'react';
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

export function HomeClient({ projects, className }: HomeClientProps) {
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

  return (
    <div className={styles.root}>
      <NavigationHeader
        devStateOverride={IS_DEV && isHome ? devNavOverride : undefined}
      />

      <main className={mainClassName}>
        <div className={styles.content}>
          {isAbout ? (
            <AboutSectionContent />
          ) : projectFromRoute ? (
            <ProjectDetail
              project={projectFromRoute}
              onDismiss={handleCloseProject}
            />
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
    </div>
  );
}
