'use client';

import { motion, type HTMLMotionProps } from 'motion/react';
import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/data/projects';
import styles from './project-list.module.css';

export interface ProjectListProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export function ProjectList({
  projects,
  onProjectClick,
  className,
  ...motionProps
}: ProjectListProps) {
  return (
    <motion.div
      {...motionProps}
      className={[styles.container, className].filter(Boolean).join(' ')}
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
