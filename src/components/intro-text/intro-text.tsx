'use client';

import { useRef, useEffect } from 'react';
import { motion, animate, useMotionValue, useMotionTemplate, useSpring, useTransform, useReducedMotion } from 'motion/react';
import styles from './intro-text.module.css';

export interface IntroTextProps {
  header: string;
  text: string;
  color?: string;
}

const MAX_DEG = 15;
const SPRING_CONFIG = { stiffness: 200, damping: 20, mass: 0.5 };
const BOUNCE_CONFIG = { type: 'spring', stiffness: 250, damping: 18 } as const;
const BASE_FOIL_OPACITY = 0.95;

export function IntroText({ header, text, color }: IntroTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const rawX = useMotionValue(0.5);
  const rawY = useMotionValue(0.5);

  const rotateY = useSpring(
    useTransform(rawX, [0, 1], [-MAX_DEG, MAX_DEG]),
    SPRING_CONFIG
  );
  const rotateX = useSpring(
    useTransform(rawY, [0, 1], [MAX_DEG, -MAX_DEG]),
    SPRING_CONFIG
  );

  const foilX = useTransform(rawX, [0, 1], [100, 0]);
  const foilY = useTransform(rawY, [0, 1], [100, 0]);
  const foilPos = useMotionTemplate`${foilX}% ${foilY}%`;
  const foilOpacity = useMotionValue(0);

  useEffect(() => {
    if (!color || shouldReduceMotion) return;
    animate(foilOpacity, BASE_FOIL_OPACITY, {
      delay: 0.25,
      duration: 0.5,
      ease: 'easeOut',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width);
    rawY.set((e.clientY - rect.top) / rect.height);
    foilOpacity.set(0.55);
  };

  const handleMouseLeave = () => {
    rawX.set(0.5);
    rawY.set(0.5);
    animate(rotateX, 0, BOUNCE_CONFIG);
    animate(rotateY, 0, BOUNCE_CONFIG);
    animate(foilOpacity, color ? BASE_FOIL_OPACITY : 0, { duration: 0.3, ease: 'easeOut' });
  };

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.h1
        className={styles.header}
        style={
          shouldReduceMotion
            ? (color ? { color } : undefined)
            : { rotateX, rotateY, transformStyle: 'preserve-3d', ...(color ? { color } : {}) }
        }
      >
        {header}
        {!shouldReduceMotion && (
          <motion.span
            className={styles.foil}
            style={{ backgroundPosition: foilPos, opacity: foilOpacity }}
            aria-hidden
          >
            {header}
          </motion.span>
        )}
      </motion.h1>
      <p className={styles.text}>
        {text}
      </p>
    </div>
  );
}
