'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { IntroText } from '@/components/intro-text';
import { InfoTable } from '@/components/project/info-table';
import { TeamList } from '@/components/project/team-list';
import { SectionBlockView } from '@/components/project/section-block';
import {
  ORDERED_ROUTE_SECTION_VARIANTS,
  ROUTE_SECTION_REDUCED_MOTION_TARGET,
} from '@/config/page-motion';
import { getAccentSolid, type Project } from '@/data/projects';
import { useResolvedProjectAccent } from '@/hooks/use-resolved-project-accent';
import styles from './project-detail.module.css';

export interface ProjectDetailProps {
  project: Project;
  /** Called when Escape is pressed (e.g. navigate home). */
  onDismiss?: () => void;
}

export function ProjectDetail({ project, onDismiss }: ProjectDetailProps) {
  const shouldReduceMotion = useReducedMotion();
  const resolvedAccent = useResolvedProjectAccent(project);
  const accentSolid = getAccentSolid(resolvedAccent);
  const sectionCount = project.sections?.length ?? 0;
  const reducedState = ROUTE_SECTION_REDUCED_MOTION_TARGET;

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
          variants={ORDERED_ROUTE_SECTION_VARIANTS}
          custom={{ enterOrder: 0, exitOrder: sectionCount }}
          initial={shouldReduceMotion ? reducedState : 'hidden'}
          animate={shouldReduceMotion ? reducedState : 'show'}
          exit={shouldReduceMotion ? reducedState : 'exit'}
        >
          <IntroText
            header={project.name}
            text={project.intro ?? project.description}
            accent={resolvedAccent}
          />
          {project.role && project.year && project.contribution && (
            <InfoTable
              role={project.role}
              year={project.year}
              contribution={project.contribution}
              accent={resolvedAccent}
            />
          )}
          {project.team && (
            <TeamList members={project.team} color={accentSolid} />
          )}
        </motion.div>

        {project.sections?.map((section, i) => (
          <motion.div
            key={`section-${i}`}
            className={styles.section}
            variants={ORDERED_ROUTE_SECTION_VARIANTS}
            custom={{ enterOrder: i + 1, exitOrder: sectionCount - i - 1 }}
            initial={shouldReduceMotion ? reducedState : 'hidden'}
            animate={shouldReduceMotion ? reducedState : 'show'}
            exit={shouldReduceMotion ? reducedState : 'exit'}
          >
            {section.blocks.map((block, j) => (
              <SectionBlockView
                key={`${j}-${block.type}`}
                block={block}
                accent={resolvedAccent}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </article>
  );
}
