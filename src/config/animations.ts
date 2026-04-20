/**
 * Shared animation configuration per web-animation-design skill.
 * Used for user-initiated interactions (buttons, presses, etc.)
 */

/** ease-out-quint — user-initiated interactions, elements entering/exiting */
export const EASE_OUT_QUINT = [0.23, 1, 0.32, 1] as [
  number,
  number,
  number,
  number,
];

/** Duration for micro-interactions (button press) */
export const PRESS_DURATION = 0.1;
export const HOVER_DURATION = 0.15;

/** Scale for press feedback — makes buttons feel responsive */
export const PRESS_SCALE = 0.97;

/** Spring for hover scale — responsive, slight bounce for a physical feel */
export const SPRING_HOVER = { type: 'spring', duration: 0.3, bounce: 0.2 } as const;

/** Spring for press/tap — snappy, minimal bounce */
export const SPRING_PRESS = { type: 'spring', duration: 0.2, bounce: 0.1 } as const;

/** Spring for icon swap (theme toggle) — light, fast, minimal overshoot */
export const SPRING_ICON_SWAP = { type: 'spring', duration: 0.35, bounce: 0.1 } as const;

/** Spring for page entrance — subtle overshoot that settles quickly */
export const SPRING_ENTRANCE = { type: 'spring', duration: 0.34, bounce: 0.1 } as const;

/** Snappy spring for home ↔ about section swap on `/` (opacity + scale) — matches document card feel */
export const SPRING_ROUTE_CONTENT = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 15,
  mass: 0.55,
};

/** Stagger container for page entrance — propagates to children via variants */
export const ENTRANCE_STAGGER_STEP = 0.09;

/** Parent container for entrance variants */
export const ENTRANCE_CONTAINER = {
  hidden: {},
  show: { transition: { staggerChildren: ENTRANCE_STAGGER_STEP } },
};

/** Blur entrance item variant — scale/opacity spring with blur fade-in */
export const BLUR_ITEM = {
  hidden: { opacity: 0, scale: 0.96, filter: 'blur(16px)' },
  show: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      scale: SPRING_ENTRANCE,
      opacity: SPRING_ENTRANCE,
      filter: { duration: 0.35, ease: EASE_OUT_QUINT },
    },
  },
};
