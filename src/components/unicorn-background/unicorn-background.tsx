'use client';

import { useState, useSyncExternalStore, useEffect, useRef } from 'react';
import { UnicornScene } from 'unicornstudio-react/next';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT_QUINT } from '@/config/animations';
import styles from './unicorn-background.module.css';

const SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.9/dist/unicornStudio.umd.js';

const OPACITY_TRANSITION_QUICK_S = 0.2;
const OPACITY_TRANSITION_REVEAL_S = 3;

export const UNICORN_PROJECT_ID_LIGHT = '2EK6P9VfdRirA3ndFURB';
export const UNICORN_PROJECT_ID_DARK = 'dU3Yx1A0I860b466LSwj';

const noopSubscribe = () => () => {};

function useHardwareCapable(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => navigator.hardwareConcurrency >= 4,
    () => false,
  );
}

function useShouldRender(): boolean {
  const reducedMotion = useReducedMotion();
  const capable = useHardwareCapable();
  return !reducedMotion && capable;
}

interface UnicornBackgroundProps {
  projectId?: string;
  paused?: boolean;
  isVisible?: boolean;
  /** Opacity when `loaded && isVisible` (0–1). */
  visibleOpacity?: number;
}

export function UnicornBackground({
  projectId = UNICORN_PROJECT_ID_LIGHT,
  paused = false,
  isVisible = true,
  visibleOpacity = 1,
}: UnicornBackgroundProps) {
  const shouldRender = useShouldRender();
  const [loaded, setLoaded] = useState(false);
  const prevLoadedRef = useRef(false);

  useEffect(() => {
    setLoaded(false);
  }, [projectId]);

  useEffect(() => {
    prevLoadedRef.current = loaded;
  }, [loaded]);

  const revealFromLoad = loaded && !prevLoadedRef.current;
  const targetOpacity = loaded ? (isVisible ? visibleOpacity : 0) : 0;
  const transition = {
    duration: revealFromLoad ? OPACITY_TRANSITION_REVEAL_S : OPACITY_TRANSITION_QUICK_S,
    ease: EASE_OUT_QUINT,
  };

  if (!shouldRender) return null;

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: targetOpacity }}
      transition={transition}
    >
      <UnicornScene
        key={projectId}
        projectId={projectId}
        sdkUrl={SDK_URL}
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        fps={60}
        lazyLoad={false}
        production
        paused={paused}
        showPlaceholderWhileLoading={false}
        ariaLabel="Decorative background"
        onLoad={() => {
          setLoaded(true);
        }}
        onError={(err) => {
          console.error('UnicornStudio scene failed to load:', err);
        }}
      />
    </motion.div>
  );
}
