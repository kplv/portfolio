'use client';

import { useState, useSyncExternalStore } from 'react';
import UnicornScene from 'unicornstudio-react/next';
import { motion, useReducedMotion } from 'motion/react';
import styles from './unicorn-background.module.css';

const SHADER_OPACITY = { home: 0.4, inner: 0.05 } as const;
const SHADER_TRANSITION = {
  type: 'spring' as const,
  visualDuration: 0.2,
  bounce: 0.2,
};

const LEGACY_PROJECT_ID = 'ssf4XIrdYQTi8HGovdhZ';

/** Pin to official UMD so the loader uses loadExternalScript (src=) instead of injectBundledScript (inline). Bundled "extensions" are ESM and break when injected as classic script.text. */
const UNICORN_SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js';

export type ShaderSurface = 'home' | 'inner';

function useHardwareCapable(): boolean {
  return useSyncExternalStore(
    () => () => {},
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
  surface: ShaderSurface;
  paused?: boolean;
  isVisible?: boolean;
}

export function UnicornBackground({
  surface,
  paused = false,
  isVisible = true,
}: UnicornBackgroundProps) {
  const shouldRender = useShouldRender();
  const [loaded, setLoaded] = useState(false);

  const targetOpacity = SHADER_OPACITY[surface];

  const visibleOpacity = loaded && isVisible ? targetOpacity : 0;

  if (!shouldRender) return null;

  return (
    <motion.div
      className={styles.wrapper}
      initial={{ opacity: 0 }}
      animate={{ opacity: visibleOpacity }}
      transition={SHADER_TRANSITION}
    >
      <UnicornScene
        projectId={LEGACY_PROJECT_ID}
        sdkUrl={UNICORN_SDK_URL}
        width="100%"
        height="100%"
        scale={1}
        dpi={1.5}
        fps={60}
        lazyLoad={false}
        production
        paused={paused}
        showPlaceholderWhileLoading={false}
        showPlaceholderOnError={false}
        ariaLabel="Ambient background animation"
        onLoad={() => setLoaded(true)}
        onError={(err) => {
          console.error('UnicornStudio scene failed to load:', err);
        }}
      />
    </motion.div>
  );
}
