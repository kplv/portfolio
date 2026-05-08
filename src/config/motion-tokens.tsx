'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { Transition } from 'motion/react';
import {
  EASE_OUT_QUINT,
  PRESS_DURATION,
  PRESS_SCALE,
  SPRING_ICON_SWAP,
  SPRING_INTERACTIVE_PHYSICS,
  SPRING_ROUTE_CONTENT,
  SPRING_THUMBNAIL_HOVER,
  THUMBNAIL_HOVER_SCALE,
  THUMBNAIL_PRESS_SCALE,
  THUMBNAIL_REST_SCALE,
} from '@/config/animations';
import { PAGE_MOTION } from '@/config/page-motion';

export interface MotionTokens {
  pressTap: {
    duration: number;
    ease: [number, number, number, number];
  };
  iconSwapSpring: Transition;
  /**
   * Shared whileTap spring + scale for theme toggle, nav back, social links,
   * masked avatar, and CV/document links.
   */
  interactiveTap: {
    spring: Transition;
    /** Shared press scale for all interactive tap targets. */
    scale: number;
  };
  avatar: {
    hoverScale: number;
    pressScale: number;
    hoverSpring: Transition;
    pressSpring: Transition;
  };
  arrow: {
    offsetX: number;
    spring: Transition;
  };
  link: {
    hoverOpacity: number;
    hoverSpring: Transition;
    underlineSpring: Transition;
  };
  cardHover: {
    /** 0–1, peak alpha of the image-wrapper background on hover */
    bgOpacity: number;
    /** seconds, fade in/out duration of the bg alpha */
    speed: number;
    /** scale of the bg plate at rest; animates to 1 on hover */
    restScale: number;
    /** transition driving the bg plate scale; spring-or-easing */
    scaleTransition: Transition;
  };
  /** Inner image (thumbnail) zoom inside the card frame. */
  cardThumbnail: {
    /** baseline image zoom inside the frame */
    restScale: number;
    /** peak zoom on hover */
    hoverScale: number;
    /** zoom on press/tap */
    pressScale: number;
  };
  /** Route-level (home / about / project) section enter+exit timing. */
  routeTransition: {
    /** seconds, delay between adjacent ordered sections */
    staggerStep: number;
    /** seconds, blur tween duration on each section */
    filterDuration: number;
    /** spring driving opacity + scale on each section */
    contentSpring: Transition;
  };
  /** Navigation header chrome (outer wrapper + back button swap). */
  nav: {
    /** Spring for the header's mount animation. */
    shellSpring: Transition;
    /** Tween for the back button enter/exit swap. */
    actionTransition: Transition;
  };
}

export const DEFAULT_MOTION_TOKENS: MotionTokens = {
  pressTap: {
    duration: PRESS_DURATION,
    ease: EASE_OUT_QUINT,
  },
  iconSwapSpring: SPRING_ICON_SWAP,
  interactiveTap: {
    spring: SPRING_INTERACTIVE_PHYSICS,
    scale: PRESS_SCALE,
  },
  avatar: {
    hoverScale: 1.15,
    pressScale: 0.88,
    hoverSpring: SPRING_INTERACTIVE_PHYSICS,
    pressSpring: SPRING_INTERACTIVE_PHYSICS,
  },
  arrow: {
    offsetX: 3,
    spring: SPRING_INTERACTIVE_PHYSICS,
  },
  link: {
    hoverOpacity: 0.7,
    hoverSpring: SPRING_INTERACTIVE_PHYSICS,
    underlineSpring: { type: 'spring', duration: 0.3, bounce: 0.1 },
  },
  cardHover: {
    bgOpacity: 0.04,
    speed: 0.18,
    restScale: 0.97,
    scaleTransition: SPRING_THUMBNAIL_HOVER,
  },
  cardThumbnail: {
    restScale: THUMBNAIL_REST_SCALE,
    hoverScale: THUMBNAIL_HOVER_SCALE,
    pressScale: THUMBNAIL_PRESS_SCALE,
  },
  routeTransition: {
    staggerStep: PAGE_MOTION.orderedSectionTiming.staggerStep,
    filterDuration: PAGE_MOTION.orderedSectionTiming.filterDuration,
    contentSpring: SPRING_ROUTE_CONTENT,
  },
  nav: {
    shellSpring: SPRING_INTERACTIVE_PHYSICS,
    actionTransition: SPRING_INTERACTIVE_PHYSICS,
  },
};

const MotionTokensContext = createContext<MotionTokens>(DEFAULT_MOTION_TOKENS);

export function useMotionTokens(): MotionTokens {
  return useContext(MotionTokensContext);
}

export function MotionTokensProvider({
  value,
  children,
}: {
  value: MotionTokens;
  children: ReactNode;
}) {
  return (
    <MotionTokensContext.Provider value={value}>
      {children}
    </MotionTokensContext.Provider>
  );
}
