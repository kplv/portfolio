import { ProjectCard } from '@/components/project-card';
import type { Project } from '@/data/projects';
import styles from './project-list.module.css';

export interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  return (
    <div className={styles.container}>

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
