'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Project } from '@/data/projects';
import { TagsList } from '@/components/tags-list';
import styles from './project-card.module.css';

export interface ProjectCardProps {
  project: Project;
  onProjectClick?: (project: Project) => void;
}

function prefetchProjectMedia(project: Project) {
  project.sections?.forEach((section) =>
    section.items.forEach((item) => {
      if (item.media.type === 'image') {
        const img = new window.Image();
        img.src = item.media.src;
      }
      if (item.media.type === 'video' && item.media.poster) {
        const img = new window.Image();
        img.src = item.media.poster;
      }
    }),
  );
}

const tapTransition = {
  duration: 0.1,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
};

const hoverTransition = {
  duration: 0.15,
  ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
};

const fadeTransition = {
  duration: 0.2,
  ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
};

function useCanHover() {
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const handler = () => setCanHover(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return canHover;
}

export function ProjectCard({ project, onProjectClick }: ProjectCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const prefetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const images = project.images ?? [project.image];
  const tagGroups = project.tags;
  const currentTagGroup = tagGroups?.[currentIndex] ?? tagGroups?.[0];
  const tagsForList = currentTagGroup ?? [];
  const hasTags = tagGroups && tagGroups.length > 0 && tagsForList.length > 0;
  const tagsDisplayText = hasTags ? tagsForList.join(' · ') : undefined;
  const currentImage = images[currentIndex];
  const imageAlt = hasTags ? tagsForList.join(' · ') : project.description;

  const cycleToNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const handlePointerEnter = useCallback(() => {
    if (!canHover) return;
    prefetchTimer.current = setTimeout(() => {
      prefetchProjectMedia(project);
    }, 100);
  }, [canHover, project]);

  const handlePointerLeave = useCallback(() => {
    if (prefetchTimer.current) {
      clearTimeout(prefetchTimer.current);
      prefetchTimer.current = null;
    }
  }, []);

  const imageVariants = {
    hidden: {
      transform: 'translateY(12px) scale(0.95)',
      opacity: 0,
    },
    visible: {
      transform: 'translateY(0) scale(1)',
      opacity: 1,
      transition: {
        duration: 0.15,
        ease: [0.23, 1, 0.32, 1] as [number, number, number, number], // ease-out-quint
      },
    },
  };

  const layoutTransition = {
    layout: {
      duration: 1.5,
      ease: [0.86, 0, 0.07, 1] as [number, number, number, number], // ease-in-out-quint (moving/morphing on screen)
    },
  };

  return (
    <motion.div
      layout={!shouldReduceMotion ? 'position' : false}
      transition={layoutTransition}
      onTapStart={() => !shouldReduceMotion && setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      className={styles.wrapper}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        className={styles.card}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) return;
          if (onProjectClick) {
            onProjectClick(project);
          } else if (images.length > 1) {
            cycleToNext();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (onProjectClick) {
              onProjectClick(project);
            } else if (images.length > 1) {
              cycleToNext();
            }
          }
        }}
      >

        <div className={styles.body}>
          <motion.div
            variants={imageVariants}
            animate="visible"
            initial={shouldReduceMotion ? false : 'hidden'}
            transition={tapTransition}
            className={styles.imageWrapper}
          >
            <motion.div
              className={styles.imageInner}
              animate={
                isPressed && !shouldReduceMotion
                  ? { scale: 1.18, transition: tapTransition }
                  : { scale: 1.2, transition: hoverTransition }
              }
              whileHover={
                canHover && !shouldReduceMotion && images.length > 1 && !isPressed
                  ? { scale: 1.25, transition: hoverTransition }
                  : undefined
              }
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={currentImage}
                  className={styles.imageFrame}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={fadeTransition}
                >
                  <Image
                    src={currentImage}
                    alt={`${project.name} - ${imageAlt}`}
                    fill
                    sizes="(max-width: 428px) 100vw, 364px"
                    quality={90}
                    unoptimized
                    className={styles.image}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          <div className={styles.textBlock}>
            {hasTags && (
              <TagsList
                tags={tagsForList}
                displayText={tagsDisplayText}
                allDisplayTexts={tagGroups?.map((tg) => tg?.join(' · ') ?? '')}
              />
            )}
            <motion.p
              layout={!shouldReduceMotion ? 'position' : false}
              transition={layoutTransition}
              className={styles.projectTitle}
            >
              <span className={styles.projectName}>{project.name}</span>
              {'. '}
              <span className={styles.projectDescription}>
                {project.description}
              </span>
            </motion.p>
          </div>



        </div>
      </div>
    </motion.div>
  );
}
