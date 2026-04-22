import {
  EASE_OUT_QUINT,
  SPRING_ROUTE_CONTENT,
} from '@/config/animations';

/** Custom prop for staggered enter/exit on route sections (home, about, project). */
export type RouteSectionOrder = {
  enterOrder: number;
  exitOrder: number;
};

/**
 * Single source of truth for route-level page motion (shell + ordered sections).
 * Tune `orderedSection` / `orderedSectionTiming` for from/to/exit and timings;
 * extend `reducedMotion.routeSectionTarget` when adding settle values.
 */
export const PAGE_MOTION = {
  orderedSection: {
    hidden: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(12px)',
    },
    show: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(12px)',
    },
  },
  orderedSectionTiming: {
    staggerStep: 0.25,
    /** Blur uses a tween (no spring overshoot on `filter`). */
    filterDuration: 0.35,
  },
  presenceBridge: {
    variants: {
      show: { opacity: 1 },
      exit: {
        opacity: 1,
        transition: { when: 'afterChildren' as const },
      },
    },
    animatePresence: { mode: 'wait' as const },
  },
  reducedMotion: {
    routeSectionTarget: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
    },
  },
} as const;

/** Mirrors `PAGE_MOTION.orderedSectionTiming.staggerStep`. */
export const ABOUT_STAGGER_STEP = PAGE_MOTION.orderedSectionTiming.staggerStep;

export function createOrderedSectionVariants(
  theme: typeof PAGE_MOTION = PAGE_MOTION,
) {
  const { hidden, show: showTarget, exit: exitTarget } = theme.orderedSection;
  const { staggerStep, filterDuration } = theme.orderedSectionTiming;

  const staggeredTransition = (orderIndex: number) => {
    const delay = orderIndex * staggerStep;
    return {
      opacity: { ...SPRING_ROUTE_CONTENT, delay },
      scale: { ...SPRING_ROUTE_CONTENT, delay },
      filter: {
        duration: filterDuration,
        ease: EASE_OUT_QUINT,
        delay,
      },
    };
  };

  return {
    hidden,
    show: (order: RouteSectionOrder) => ({
      ...showTarget,
      transition: staggeredTransition(order.enterOrder),
    }),
    exit: (order: RouteSectionOrder) => ({
      ...exitTarget,
      transition: staggeredTransition(order.exitOrder),
    }),
  };
}

export const ORDERED_ROUTE_SECTION_VARIANTS =
  createOrderedSectionVariants(PAGE_MOTION);

/** Legacy name — same as `ORDERED_ROUTE_SECTION_VARIANTS`. */
export const ORDERED_ROUTE_SECTION_FADE = ORDERED_ROUTE_SECTION_VARIANTS;

export const ABOUT_SECTION_FADE = ORDERED_ROUTE_SECTION_VARIANTS;
export const HOME_SECTION_FADE = ORDERED_ROUTE_SECTION_VARIANTS;

export const ABOUT_PRESENCE_BRIDGE = PAGE_MOTION.presenceBridge.variants;

export const ROUTE_SHELL_ANIMATE_PRESENCE_PROPS =
  PAGE_MOTION.presenceBridge.animatePresence;

export const ROUTE_SECTION_REDUCED_MOTION_TARGET =
  PAGE_MOTION.reducedMotion.routeSectionTarget;
