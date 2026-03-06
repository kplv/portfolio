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
      style={{ '--sheet-accent': accentColor } as React.CSSProperties}
      initial={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
      animate={shouldReduceMotion ? { opacity: 1 } : { y: 0 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { y: '100%' }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
    >
      {/* White scrollable panel */}
      <div className={styles.panel}>
        {/* Close button — sticky inside panel, pins to top-right on scroll */}
        <div className={styles.closeButtonWrapper}>
          <Button
            ghost
            label="Close"
            icon={
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 24.2915C12.5234 24.2915 11.1392 24.0112 9.84717 23.4507C8.55518 22.897 7.41699 22.1279 6.43262 21.1436C5.45508 20.166 4.68945 19.0347 4.13574 17.7495C3.58203 16.4575 3.30518 15.0732 3.30518 13.5967C3.30518 12.1201 3.58203 10.7358 4.13574 9.44385C4.68945 8.15186 5.45508 7.01709 6.43262 6.03955C7.41699 5.05518 8.55518 4.28613 9.84717 3.73242C11.1392 3.17871 12.5234 2.90186 14 2.90186C15.4766 2.90186 16.8608 3.17871 18.1528 3.73242C19.4448 4.28613 20.5796 5.05518 21.5571 6.03955C22.5347 7.01709 23.3003 8.15186 23.854 9.44385C24.4146 10.7358 24.6948 12.1201 24.6948 13.5967C24.6948 15.0732 24.4146 16.4575 23.854 17.7495C23.3003 19.0347 22.5347 20.166 21.5571 21.1436C20.5796 22.1279 19.4448 22.897 18.1528 23.4507C16.8608 24.0112 15.4766 24.2915 14 24.2915ZM10.688 17.9648C11.0024 17.9648 11.2656 17.8623 11.4775 17.6572L14.0103 15.1143L16.5532 17.6572C16.7515 17.8623 17.0044 17.9648 17.312 17.9648C17.6128 17.9648 17.8657 17.8623 18.0708 17.6572C18.2759 17.4521 18.3784 17.1992 18.3784 16.8984C18.3784 16.6045 18.2725 16.3584 18.0605 16.1602L15.5073 13.6069L18.0708 11.0537C18.2759 10.8418 18.3784 10.5957 18.3784 10.3154C18.3784 10.0146 18.2759 9.76514 18.0708 9.56689C17.8726 9.36182 17.6265 9.25928 17.3325 9.25928C17.0317 9.25928 16.7788 9.36182 16.5737 9.56689L14.0103 12.1201L11.457 9.57715C11.2451 9.37207 10.9888 9.26953 10.688 9.26953C10.394 9.26953 10.1445 9.37207 9.93945 9.57715C9.74121 9.77539 9.64209 10.0249 9.64209 10.3257C9.64209 10.606 9.74463 10.8486 9.94971 11.0537L12.5132 13.6069L9.94971 16.1704C9.74463 16.3755 9.64209 16.6182 9.64209 16.8984C9.64209 17.1992 9.74121 17.4521 9.93945 17.6572C10.1445 17.8623 10.394 17.9648 10.688 17.9648Z" fill="currentColor"/>
              </svg>
            }
            className={styles.closeButton}
            onClick={onClose}
          />
        </div>

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
