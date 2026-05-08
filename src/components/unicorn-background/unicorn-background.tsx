'use client';

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { useReducedMotion } from 'motion/react';
import styles from './unicorn-background.module.css';

const SHADER_OPACITY = { home: 0.4, inner: 0.05 } as const;
const LEGACY_PROJECT_ID = 'ssf4XIrdYQTi8HGovdhZ';
const UNICORN_SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js';

interface UnicornSceneInstance {
  paused: boolean;
  destroy: () => void;
}

interface UnicornStudioApi {
  addScene: (options: Record<string, unknown>) => Promise<UnicornSceneInstance>;
}

declare global {
  interface Window {
    UnicornStudio?: UnicornStudioApi;
  }
}

export type ShaderSurface = 'home' | 'inner';

function useShouldRender(): boolean {
  const reducedMotion = useReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    setCapable((navigator.hardwareConcurrency ?? 4) >= 4);
  }, []);

  return !reducedMotion && capable;
}

function useIsPhoneViewport(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener('resize', onStoreChange);
      window.visualViewport?.addEventListener('resize', onStoreChange);
      return () => {
        window.removeEventListener('resize', onStoreChange);
        window.visualViewport?.removeEventListener('resize', onStoreChange);
      };
    },
    () => (window.visualViewport?.width ?? window.innerWidth) <= 600,
    () => false,
  );
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
  const isPhoneViewport = useIsPhoneViewport();
  const [loaded, setLoaded] = useState(false);
  const sceneRef = useRef<UnicornSceneInstance | null>(null);
  const initCalledRef = useRef(false);
  const reactId = useId();
  const containerId = `unicorn-bg-${reactId.replace(/:/g, '')}`;
  const targetOpacity = SHADER_OPACITY[surface];
  const visibleOpacity = loaded && isVisible ? targetOpacity : 0;
  const sceneDpi = isPhoneViewport ? 1 : 1.5;
  const sceneFps = isPhoneViewport ? 30 : 60;

  const initScene = useCallback(() => {
    if (!shouldRender || initCalledRef.current || !window.UnicornStudio) return;
    initCalledRef.current = true;

    window.UnicornStudio.addScene({
      elementId: containerId,
      projectId: LEGACY_PROJECT_ID,
      scale: 1,
      dpi: sceneDpi,
      fps: sceneFps,
      lazyLoad: false,
      production: true,
      interactivity: {
        mouse: { disableMobile: true },
      },
    })
      .then((scene) => {
        sceneRef.current = scene;
        setLoaded(true);
      })
      .catch((err: unknown) => {
        console.error('UnicornStudio scene failed to load:', err);
      });
  }, [containerId, isPhoneViewport, isVisible, paused, sceneDpi, sceneFps, shouldRender, surface]);

  useEffect(() => {
    if (!shouldRender) return;
    if (window.UnicornStudio) {
      initScene();
    }
  }, [initScene, shouldRender]);

  useEffect(() => {
    return () => {
      sceneRef.current?.destroy();
      sceneRef.current = null;
      initCalledRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.paused = paused;
  }, [paused]);

  if (!shouldRender) return null;

  return (
    <>
      <Script src={UNICORN_SDK_URL} strategy="afterInteractive" onLoad={initScene} />
      <div className={styles.wrapper} style={{ opacity: visibleOpacity }}>
        <div id={containerId} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
}
