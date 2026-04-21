'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { IntroText } from '@/components/intro-text';
import { InfoTable } from '@/components/project/info-table';
import { TeamList } from '@/components/project/team-list';
import { ProjectMediaBlock } from '@/components/project/media-block';
import { ORDERED_ROUTE_SECTION_FADE } from '@/config/animations';
import { getAccentColor, getHeaderGradient, type Project } from '@/data/projects';
import styles from './project-detail.module.css';

export interface ProjectDetailProps {
  project: Project;
  /** Called when Escape is pressed (e.g. navigate home). */
  onDismiss?: () => void;
}

export function ProjectDetail({ project, onDismiss }: ProjectDetailProps) {
  const shouldReduceMotion = useReducedMotion();
  const accentColor = getAccentColor(project);
  const headerGradient = getHeaderGradient(project);
  const sectionCount = project.sections?.length ?? 0;
  const reducedState = { opacity: 1 };

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
        <motion.div
          className={styles.entryBlock}
          variants={ORDERED_ROUTE_SECTION_FADE}
          custom={{ enterOrder: 0, exitOrder: sectionCount }}
          initial={shouldReduceMotion ? reducedState : 'hidden'}
          animate={shouldReduceMotion ? reducedState : 'show'}
          exit={shouldReduceMotion ? reducedState : 'exit'}
        >
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
        </motion.div>

        {project.sections?.map((section, i) => (
          <motion.div
            key={section.title}
            className={styles.section}
            variants={ORDERED_ROUTE_SECTION_FADE}
            custom={{ enterOrder: i + 1, exitOrder: sectionCount - i - 1 }}
            initial={shouldReduceMotion ? reducedState : 'hidden'}
            animate={shouldReduceMotion ? reducedState : 'show'}
            exit={shouldReduceMotion ? reducedState : 'exit'}
          >
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
          </motion.div>
        ))}
      </div>
    </article>
  );
}
