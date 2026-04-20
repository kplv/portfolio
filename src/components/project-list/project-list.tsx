'use client';

import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/data/projects';
import styles from './project-list.module.css';

export interface ProjectListProps {
  projects: Project[];
  onProjectClick?: (project: Project) => void;
}

export function ProjectList({ projects, onProjectClick }: ProjectListProps) {
  return (
    <div className={styles.container}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onProjectClick={onProjectClick}
        />
      ))}
    </div>
  );
}
