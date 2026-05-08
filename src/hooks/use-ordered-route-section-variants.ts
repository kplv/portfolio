'use client';

import { useMemo } from 'react';
import {
  createOrderedSectionVariants,
  PAGE_MOTION,
} from '@/config/page-motion';
import { useMotionTokens } from '@/config/motion-tokens';

/**
 * Live ordered-section variants driven by {@link MotionTokens.routeTransition}.
 * Values match `PAGE_MOTION` defaults from {@link DEFAULT_MOTION_TOKENS}.
 */
export function useOrderedRouteSectionVariants() {
  const { routeTransition } = useMotionTokens();
  return useMemo(
    () =>
      createOrderedSectionVariants({
        ...PAGE_MOTION,
        orderedSectionTiming: {
          staggerStep: routeTransition.staggerStep,
          filterDuration: routeTransition.filterDuration,
          contentSpring: routeTransition.contentSpring,
        },
      }),
    [
      routeTransition.staggerStep,
      routeTransition.filterDuration,
      routeTransition.contentSpring,
    ],
  );
}
