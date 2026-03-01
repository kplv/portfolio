'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import ScrambleText from 'scramble-text';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import type { Project } from '@/data/projects';
import { Button } from '@/components/button';
import { InfoIcon } from '@/components/icons/info-icon';
import styles from './project-card.module.css';

export interface ProjectCardProps {
  project: Project;
  onInfoClick?: (project: Project) => void;
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

const SCRAMBLE_EMOJIS = ['⚡', '🔌', '🔋', '🌞', '💡', '🌱', '☀️', '🏠'];
const SCRAMBLE_CHARS = [...'!@#$%^&*()_+-=[]{}|;:,.<>?/~`░▒▓█▀▄■□▪▫●○◆◇◈◊※†‡', ...SCRAMBLE_EMOJIS];
const SCRAMBLE_MINIMALISTC = ['░', '▒', '▓', '█'];

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

export function ProjectCard({ project, onInfoClick }: ProjectCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const canHover = useCanHover();
  const descriptionRef = useRef<HTMLSpanElement>(null);
  const scrambleRef = useRef<{ stop: () => void; start: () => void } | null>(null);
  const isInitialMount = useRef(true);

  const images = project.images ?? [project.image];
  const descriptions = project.descriptions ?? [project.description];
  const currentImage = images[currentIndex];
  const currentDescription = descriptions[currentIndex] ?? descriptions[0];

  const cycleToNext = useCallback(() => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

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
      duration: 0.1,
      ease: [0.86, 0, 0.07, 1] as [number, number, number, number], // ease-in-out-quint (moving/morphing on screen)
    },
  };

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/39460fec-bee2-4a84-86f6-dc7b2c907bdf', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'efb6c6' }, body: JSON.stringify({ sessionId: 'efb6c6', location: 'project-card.tsx:useEffect', message: 'effect ran', data: { currentDescription, descriptionsLen: descriptions.length, shouldReduceMotion, isInitialMount: isInitialMount.current, hasRef: !!descriptionRef.current }, hypothesisId: 'H3', timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    if (descriptions.length <= 1 || shouldReduceMotion || !descriptionRef.current) return;
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    scrambleRef.current?.stop();
    // #region agent log
    fetch('http://127.0.0.1:7244/ingest/39460fec-bee2-4a84-86f6-dc7b2c907bdf', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'efb6c6' }, body: JSON.stringify({ sessionId: 'efb6c6', location: 'project-card.tsx:create ScrambleText', message: 'creating ScrambleText', data: { currentDescription, innerHTML: descriptionRef.current?.innerHTML?.slice(0, 50) }, hypothesisId: 'H1', timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    scrambleRef.current = new ScrambleText(descriptionRef.current, {
      timeOffset: 16,
      chars: SCRAMBLE_MINIMALISTC,
      callback: () => {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/39460fec-bee2-4a84-86f6-dc7b2c907bdf', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'efb6c6' }, body: JSON.stringify({ sessionId: 'efb6c6', location: 'project-card.tsx:scramble callback', message: 'scramble COMPLETE', data: { currentDescription }, hypothesisId: 'H4', runId: 'post-fix', timestamp: Date.now() }) }).catch(() => { });
        // #endregion
      },
    });
    scrambleRef.current.start();
    return () => {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/39460fec-bee2-4a84-86f6-dc7b2c907bdf', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'efb6c6' }, body: JSON.stringify({ sessionId: 'efb6c6', location: 'project-card.tsx:cleanup', message: 'effect cleanup stop()', hypothesisId: 'H3', timestamp: Date.now() }) }).catch(() => { });
      // #endregion
      scrambleRef.current?.stop();
    };
  }, [currentDescription, descriptions.length, shouldReduceMotion]);

  return (
    <motion.div
      layout={!shouldReduceMotion}
      transition={layoutTransition}
      onTapStart={() => !shouldReduceMotion && setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      className={styles.wrapper}
    >
      <div
        className={styles.card}
        role={images.length > 1 ? 'button' : undefined}
        tabIndex={images.length > 1 ? 0 : undefined}
        onClick={
          images.length > 1
            ? (e) => {
              if ((e.target as HTMLElement).closest('button')) return;
              cycleToNext();
            }
            : undefined
        }
        onKeyDown={
          images.length > 1
            ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                cycleToNext();
              }
            }
            : undefined
        }
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
                  ? { scale: 1.1, transition: tapTransition }
                  : { scale: 1.2, transition: hoverTransition }
              }
              whileHover={
                canHover && !shouldReduceMotion && images.length > 1 && !isPressed
                  ? { scale: 1.25, transition: hoverTransition }
                  : undefined
              }
            >
              <AnimatePresence mode="sync" initial={false}>
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
                    alt={`${project.name} - ${currentDescription}`}
                    fill
                    sizes="(max-width: 428px) 100vw, 364px"
                    quality={90}
                    unoptimized
                    className={styles.image}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>
            <Button
              label=""
              ghost
              icon={<InfoIcon size={28} />}
              className={styles.infoButton}
              hitSlop="info"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onInfoClick?.(project);
              }}
            />
          </motion.div>

          <p className={styles.projectTitle}>
            <span className={styles.projectName}>{project.name}</span>
            {'. '}
            <span
              ref={descriptionRef}
              className={styles.projectDescription}
            >
              {currentDescription}
            </span>
          </p>



        </div>
      </div>
    </motion.div>
  );
}
