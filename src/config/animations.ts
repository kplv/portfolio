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
