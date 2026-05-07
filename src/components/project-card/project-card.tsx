'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { Transition } from 'motion/react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  SPRING_THUMBNAIL_HOVER,
  SPRING_THUMBNAIL_PRESS,
  THUMBNAIL_HOVER_SCALE,
  THUMBNAIL_PRESS_SCALE,
  THUMBNAIL_REST_SCALE,
} from '@/config/animations';
import { getAccentSolid, getAccentTextStyle, type Project } from '@/data/projects';
import { useResolvedProjectAccent } from '@/hooks/use-resolved-project-accent';
import styles from './project-card.module.css';

export interface ProjectCardThumbnailTuning {
  restScale: number;
  hoverScale: number;
  pressScale: number;
  hover: Transition;
  press: Transition;
}

const defaultThumbnailTuning: ProjectCardThumbnailTuning = {
  restScale: THUMBNAIL_REST_SCALE,
  hoverScale: THUMBNAIL_HOVER_SCALE,
  pressScale: THUMBNAIL_PRESS_SCALE,
  hover: SPRING_THUMBNAIL_HOVER,
  press: SPRING_THUMBNAIL_PRESS,
};

export interface ProjectCardProps {
  project: Project;
  onProjectClick?: (project: Project) => void;
  tuning?: ProjectCardThumbnailTuning;
}

function prefetchProjectMedia(project: Project) {
  project.sections?.forEach((section) => {
    section.blocks.forEach((block) => {
      if (block.type !== 'media') return;
      const medias = Array.isArray(block.media)
        ? block.media
        : [block.media];
      for (const m of medias) {
        if (m.type === 'image') {
          const img = new window.Image();
          img.src = m.src;
        }
        if (m.type === 'video' && m.poster) {
          const img = new window.Image();
          img.src = m.poster;
        }
      }
    });
  });
}

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

export function ProjectCard({
  project,
  onProjectClick,
  tuning,
}: ProjectCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const prefetchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const t = tuning ?? defaultThumbnailTuning;

  const resolvedAccent = useResolvedProjectAccent(project);
  const accentSolid = getAccentSolid(resolvedAccent);
  const titleStyle = getAccentTextStyle(resolvedAccent);

  const images = project.images ?? [project.image];
  const currentImage = images[currentIndex];

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

  return (
    <motion.div
      className={styles.wrapper}
      style={{ '--project-accent': accentSolid } as React.CSSProperties}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div className={styles.card}>

        <div className={styles.body}>

          <motion.div
            className={styles.imageWrapper}
            role="button"
            tabIndex={0}
            onTapStart={() => !shouldReduceMotion && setIsPressed(true)}
            onTap={() => setIsPressed(false)}
            onTapCancel={() => setIsPressed(false)}
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
            <motion.div
              className={styles.imageInner}
              animate={
                isPressed && !shouldReduceMotion
                  ? { scale: t.pressScale, transition: t.press }
                  : { scale: t.restScale, transition: t.hover }
              }
              whileHover={
                canHover && !shouldReduceMotion && !isPressed
                  ? { scale: t.hoverScale, transition: t.hover }
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
                    alt={`${project.name} - ${project.description}`}
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
            <motion.p className={styles.projectTitle}>
              <span className={styles.projectName} style={titleStyle}>
                {project.name}.{' '}
              </span>
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
