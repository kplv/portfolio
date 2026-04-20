'use client';

import { useEffect } from 'react';
import { IntroText } from '@/components/intro-text';
import { InfoTable } from '@/components/project/info-table';
import { TeamList } from '@/components/project/team-list';
import { ProjectMediaBlock } from '@/components/project/media-block';
import { getAccentColor, getHeaderGradient, type Project } from '@/data/projects';
import styles from './project-detail.module.css';

export interface ProjectDetailProps {
  project: Project;
  /** Called when Escape is pressed (e.g. navigate home). */
  onDismiss?: () => void;
}

export function ProjectDetail({ project, onDismiss }: ProjectDetailProps) {
  const accentColor = getAccentColor(project);
  const headerGradient = getHeaderGradient(project);

  useEffect(() => {
    if (!onDismiss) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onDismiss]);

  return (
    <article className={styles.root}>
      <div className={styles.panelContent}>
        <div className={styles.entryBlock}>
          <IntroText
            header={project.name}
            text={project.intro ?? project.description}
            gradient={headerGradient}
          />
          {project.role && project.year && project.contribution && (
            <InfoTable
              role={project.role}
              year={project.year}
              contribution={project.contribution}
              color={accentColor}
            />
          )}
          {project.team && (
            <TeamList members={project.team} color={accentColor} />
          )}
        </div>

        {project.sections?.map((section) => (
          <div key={section.title} className={styles.section}>
            <h2
              className={styles.sectionTitle}
              style={{
                backgroundImage: headerGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {section.title}
            </h2>
            <div className={styles.mediaGrid}>
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className={
                    item.fullWidth
                      ? styles.mediaGridItemFull
                      : styles.mediaGridItem
                  }
                >
                  <ProjectMediaBlock
                    label={item.label}
                    media={item.media}
                    accentColor={accentColor}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}
