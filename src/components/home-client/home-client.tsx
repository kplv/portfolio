'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { IntroText } from '@/components/intro-text';
import { ProjectList } from '@/components/project-list';
import { SocialLink } from '@/components/social-link/social-link';
import { SocialLinkList } from '@/components/social-link-list/social-link-list';
import { ProjectModal } from '@/components/project-modal';
import { EASE_OUT_QUINT } from '@/config/animations';
import { getAccentColor, type Project } from '@/data/projects';
import styles from './home-client.module.css';


export interface HomeClientProps {
  projects: Project[];
  /** Page-level layout class from page.module.css applied to the main element */
  className?: string;
}

export function HomeClient({ projects, className }: HomeClientProps) {
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const shouldReduceMotion = useReducedMotion();

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
          <IntroText
            header="Denis Kopylov"
            text="I'm a product designer by day and an engineer by night. I bring ideas to life in code, sweat over details, and strive for a joyful user experience. I'm also a proficient mentor and a design leader. Now leading design at Ostrom."
          />
          <SocialLinkList>
            <SocialLink href="" text="LinkedIn" />
            <SocialLink href="https://www.are.na/denis-kopylov" text="Are.na" />
            <SocialLink href="" text="E-Mail" />
          </SocialLinkList>
          <ProjectList projects={projects} onProjectClick={setOpenProject} />
        </motion.main>
      </div>

      {/* Project modal — slides up from bottom */}
      <AnimatePresence>
        {openProject && (
          <ProjectModal
            key={openProject.id}
            project={openProject}
            projects={projects}
            onClose={() => setOpenProject(null)}
            onNextProject={(p) => setOpenProject(p)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
