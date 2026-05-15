'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { useDialKit, type DialConfig, type ResolvedValues } from 'dialkit';

const projectCardTitleDialConfig = {
  iconSpring: { type: 'spring' as const, visualDuration: 0.38, bounce: 0.22 },
  /** 0…360° in DialKit; default 340° ≈ −20° for the rest pose (see `dialRotationToMotionDegrees`). */
  rotateInitial: [340, 0, 360],
  rotateTarget: [0, 0, 360],
  scaleInitial: [0.96, 0.75, 1],
  scaleTarget: [1, 0.92, 1.05],
  blurInitialPx: [2, 0, 20],
  blurTargetPx: [0, 0, 6],
} satisfies DialConfig;

export type ProjectCardTitleDialValues = ResolvedValues<
  typeof projectCardTitleDialConfig
>;

const TitleDialContext = createContext<ProjectCardTitleDialValues | null>(null);

/** Shipped defaults when `ProjectCard` renders outside `ProjectCardTitleDialProvider`. */
const TITLE_DIAL_FALLBACK: ProjectCardTitleDialValues = {
  iconSpring: projectCardTitleDialConfig.iconSpring,
  rotateInitial: projectCardTitleDialConfig.rotateInitial[0],
  rotateTarget: projectCardTitleDialConfig.rotateTarget[0],
  scaleInitial: projectCardTitleDialConfig.scaleInitial[0],
  scaleTarget: projectCardTitleDialConfig.scaleTarget[0],
  blurInitialPx: projectCardTitleDialConfig.blurInitialPx[0],
  blurTargetPx: projectCardTitleDialConfig.blurTargetPx[0],
};

/**
 * Mount once per list (or app section) so DialKit registers a single "Project card title" panel.
 */
export function ProjectCardTitleDialProvider({ children }: { children: ReactNode }) {
  const values = useDialKit('Project card title', projectCardTitleDialConfig);
  return (
    <TitleDialContext.Provider value={values}>{children}</TitleDialContext.Provider>
  );
}

export function useProjectCardTitleDial(): ProjectCardTitleDialValues {
  return useContext(TitleDialContext) ?? TITLE_DIAL_FALLBACK;
}

/**
 * Map DialKit rotation 0…360° to Motion degrees in (−180, 180] so springs take the short path
 * (e.g. 340° → −20°).
 */
export function dialRotationToMotionDegrees(deg: number): number {
  if (deg <= 180) return deg;
  return deg - 360;
}
