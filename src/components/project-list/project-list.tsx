'use client';

import { motion, useReducedMotion } from 'motion/react';
import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/data/projects';
import styles from './project-list.module.css';

export interface ProjectListProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export function ProjectList({ projects, onProjectClick }: ProjectListProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      layout={!shouldReduceMotion}
      transition={{
        layout: { duration: 1.5, ease: [0.86, 0, 0.07, 1] }, // ease-in-out-quint (moving/morphing on screen)
      }}
      className={styles.container}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onProjectClick={onProjectClick}
        />
      ))}
    </motion.div>
  );
}
