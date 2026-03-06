'use client';

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Button } from '@/components/button';
import { IntroText } from '@/components/intro-text';
import { InfoTable } from '@/components/project/info-table';
import { TeamList } from '@/components/project/team-list';
import { ProjectMediaBlock } from '@/components/project/media-block';
import type { Project } from '@/data/projects';
import styles from './project-modal.module.css';

export interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const accentColor = project.accentColor ?? 'var(--mint-400)';

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className={styles.sheet}
      style={
        {
          backgroundColor: accentColor,
          '--sheet-accent': accentColor,
        } as React.CSSProperties
      }
      initial={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
      animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
      transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
    >
      {/* Close button — positioned above the white panel */}
      <div className={styles.closeButtonWrapper}>
        <Button
          ghost
          label="Close"
          icon={<img src="/close.svg" alt="" width={28} height={28} />}
          className={styles.closeButton}
          onClick={onClose}
        />
      </div>

      {/* White scrollable panel */}
      <div className={styles.panel}>
        <div className={styles.panelContent}>
          {/* Entry block */}
          <div className={styles.entryBlock}>
            <IntroText
              header={project.name}
              text={project.intro ?? project.description}
              color={accentColor}
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

          {/* Content sections */}
          {project.sections?.map((section) => (
            <div key={section.title} className={styles.section}>
              <h2
                className={styles.sectionTitle}
                style={{ color: accentColor }}
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
      </div>
    </motion.div>
  );
}
