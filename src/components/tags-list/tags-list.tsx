'use client';

import { useEffect, useRef } from 'react';
import ScrambleText from 'scramble-text';
import { useReducedMotion } from 'motion/react';
import styles from './tags-list.module.css';

const SCRAMBLE_MINIMALISTC = ['░', '▒', '▓', '█'];

export interface TagsListProps {
  tags: string[];
  /** When provided, used instead of tags.join(' · ') for display and scramble. Used when cycling through tag groups. */
  displayText?: string;
  /** All possible display strings when cycling. Used to reserve min-width so layout doesn't jump. */
  allDisplayTexts?: string[];
}

export function TagsList({
  tags,
  displayText: displayTextProp,
  allDisplayTexts,
}: TagsListProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const scrambleRef = useRef<{ stop: () => void; start: () => void } | null>(null);
  const isInitialMount = useRef(true);
  const shouldReduceMotion = useReducedMotion();

  const displayText =
    displayTextProp !== undefined
      ? displayTextProp
      : tags.length > 0
        ? tags.join(' · ')
        : '';

  const minWidthCh =
    allDisplayTexts?.length &&
    allDisplayTexts.reduce((max, s) => Math.max(max, s.length), 0);

  useEffect(() => {
    if (!textRef.current || !displayText) return;

    if (shouldReduceMotion) {
      textRef.current.textContent = displayText;
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      textRef.current.textContent = displayText;
      return;
    }

    scrambleRef.current?.stop();
    scrambleRef.current = new ScrambleText(textRef.current, {
      timeOffset: 16,
      chars: SCRAMBLE_MINIMALISTC,
    });
    scrambleRef.current.start();
    return () => scrambleRef.current?.stop();
  }, [displayText, shouldReduceMotion]);

  if (!displayText) return null;

  return (
    <div
      className={styles.wrapper}
      style={minWidthCh ? { minWidth: `${minWidthCh}ch` } : undefined}
    >
      <span ref={textRef} className={styles.tagsList}>
        {displayText}
      </span>
    </div>
  );
}
