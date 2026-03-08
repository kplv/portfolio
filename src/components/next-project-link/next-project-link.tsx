'use client';

import { motion, useReducedMotion } from 'motion/react';
import { PRESS_SCALE, SPRING_HOVER, SPRING_PRESS } from '@/config/animations';
import type { Project } from '@/data/projects';
import styles from './next-project-link.module.css';

export interface NextProjectLinkProps {
  currentProject: Project;
  projects: Project[];
  onSelectProject: (project: Project) => void;
}

export function NextProjectLink({
  currentProject,
  projects,
  onSelectProject,
}: NextProjectLinkProps) {
  const shouldReduceMotion = useReducedMotion();
  const currentIndex = projects.findIndex((p) => p.id === currentProject.id);
  const nextIndex = (currentIndex + 1) % projects.length;
  const nextProject = projects[nextIndex];

  if (projects.length <= 1 || !nextProject) {
    return <p className={styles.text}>Fancy Other Project?</p>;
  }

  const handleClick = () => {
    onSelectProject(nextProject);
  };

  return (
    <motion.button
      type="button"
      className={styles.link}
      onClick={handleClick}
      initial={{ backgroundColor: 'transparent' }}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              backgroundColor: 'color-mix(in oklch, var(--background-color) 73%, white)',
            }
      }
      whileTap={
        shouldReduceMotion ? undefined : { scale: PRESS_SCALE }
      }
      transition={
        shouldReduceMotion
          ? undefined
          : { backgroundColor: SPRING_HOVER, scale: SPRING_PRESS }
      }
    >
      Fancy Other Project?
    </motion.button>
  );
}
