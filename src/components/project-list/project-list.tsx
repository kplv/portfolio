'use client';

import { useDialKit } from 'dialkit';
import { motion, type HTMLMotionProps } from 'motion/react';
import { ProjectCard, type ProjectCardThumbnailTuning } from '@/components/project-card';
import {
  SPRING_THUMBNAIL_HOVER,
  SPRING_THUMBNAIL_PRESS,
  THUMBNAIL_HOVER_SCALE,
  THUMBNAIL_PRESS_SCALE,
  THUMBNAIL_REST_SCALE,
} from '@/config/animations';
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
  const tuning = useDialKit(
    'Project Thumbnail',
    {
      restScale: [THUMBNAIL_REST_SCALE, 0.8, 1.5, 0.01],
      hoverScale: [THUMBNAIL_HOVER_SCALE, 0.8, 1.5, 0.01],
      pressScale: [THUMBNAIL_PRESS_SCALE, 0.8, 1.5, 0.01],
      hover: { ...SPRING_THUMBNAIL_HOVER },
      press: { ...SPRING_THUMBNAIL_PRESS },
    },
    {
      shortcuts: {
        restScale: { key: 'r', mode: 'fine' },
        hoverScale: { key: 'h', mode: 'fine' },
        pressScale: { key: 'p', mode: 'fine' },
      },
    },
  );

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
          tuning={tuning as ProjectCardThumbnailTuning}
        />
      ))}
    </motion.div>
  );
}
