'use client';

import { useEffect, useRef } from 'react';
import ScrambleText from 'scramble-text';
import { motion, useReducedMotion } from 'motion/react';
import styles from './description-pill.module.css';

const SCRAMBLE_MINIMALISTC = ['░', '▒', '▓', '█'];

const layoutTransition = {
  layout: {
    duration: 1.5,
    ease: [0.86, 0, 0.07, 1] as [number, number, number, number],
  },
};

export interface DescriptionPillProps {
  text: string;
}

export function DescriptionPill({ text }: DescriptionPillProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const scrambleRef = useRef<{ stop: () => void; start: () => void } | null>(null);
  const isInitialMount = useRef(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!textRef.current) return;

    if (shouldReduceMotion) {
      textRef.current.textContent = text;
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      textRef.current.textContent = text;
      return;
    }

    scrambleRef.current?.stop();
    scrambleRef.current = new ScrambleText(textRef.current, {
      timeOffset: 16,
      chars: SCRAMBLE_MINIMALISTC,
    });
    scrambleRef.current.start();
    return () => scrambleRef.current?.stop();
  }, [text, shouldReduceMotion]);

  return (
    <motion.span
      layout={!shouldReduceMotion ? 'position' : false}
      transition={layoutTransition}
      className={styles.pill}
    >
      <span ref={textRef}>{text}</span>
    </motion.span>
  );
}
