'use client';

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from 'react';
import Script from 'next/script';
import { useReducedMotion } from 'motion/react';
import styles from './unicorn-background.module.css';

const SHADER_OPACITY = { home: 0.4, inner: 0.05 } as const;
const UNICORN_SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js';
const PHONE_VIEWPORT_QUERY = '(max-width: 600px)';

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
  const capable = useSyncExternalStore(
    () => () => {},
    () => (navigator.hardwareConcurrency ?? 4) >= 4,
    () => false,
  );

  return !reducedMotion && capable;
}

function useIsPhoneViewport(): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      const mediaQuery = window.matchMedia(PHONE_VIEWPORT_QUERY);
      mediaQuery.addEventListener('change', onStoreChange);
      return () => {
        mediaQuery.removeEventListener('change', onStoreChange);
      };
    },
    () => window.matchMedia(PHONE_VIEWPORT_QUERY).matches,
    () => false,
  );
}

interface UnicornBackgroundProps {
  projectId: string;
  surface: ShaderSurface;
  paused?: boolean;
  isVisible?: boolean;
}

export function UnicornBackground({
  projectId,
  surface,
  paused = false,
  isVisible = true,
}: UnicornBackgroundProps) {
  const shouldRender = useShouldRender();
  const isPhoneViewport = useIsPhoneViewport();
  const [loadedSceneKey, setLoadedSceneKey] = useState<string | null>(null);
  const sceneRef = useRef<UnicornSceneInstance | null>(null);
  const activeSceneKeyRef = useRef<string | null>(null);
  const reactId = useId();
  const containerId = `unicorn-bg-${reactId.replace(/:/g, '')}`;
  const targetOpacity = SHADER_OPACITY[surface];
  const sceneDpi = isPhoneViewport ? 1 : 1.5;
  const sceneFps = isPhoneViewport ? 30 : 60;
  const sceneKey = `${projectId}:${sceneDpi}:${sceneFps}`;
  const visibleOpacity = loadedSceneKey === sceneKey && isVisible ? targetOpacity : 0;

  const initScene = useCallback(() => {
    if (!shouldRender || !window.UnicornStudio) return;
    if (activeSceneKeyRef.current === sceneKey) return;

    sceneRef.current?.destroy();
    sceneRef.current = null;
    activeSceneKeyRef.current = sceneKey;

    window.UnicornStudio.addScene({
      elementId: containerId,
      projectId,
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
        if (activeSceneKeyRef.current !== sceneKey) {
          scene.destroy();
          return;
        }
        sceneRef.current = scene;
        scene.paused = paused;
        setLoadedSceneKey(sceneKey);
      })
      .catch((err: unknown) => {
        if (activeSceneKeyRef.current === sceneKey) {
          activeSceneKeyRef.current = null;
        }
        console.error('UnicornStudio scene failed to load:', err);
      });
  }, [containerId, paused, projectId, sceneDpi, sceneFps, sceneKey, shouldRender]);

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
      activeSceneKeyRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (shouldRender) return;
    sceneRef.current?.destroy();
    sceneRef.current = null;
    activeSceneKeyRef.current = null;
  }, [shouldRender]);

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
