'use client';

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';
import Script from 'next/script';
import { useReducedMotion } from 'motion/react';
import {
  applyUnicornTheme,
  getThemePreset,
  type UnicornSceneInstance,
  type UnicornTheme,
} from './unicorn-theme';
import styles from './unicorn-background.module.css';

const SHADER_OPACITY = {
  light: { home: 0.6, inner: 0.3 },
  dark: { home: 0.1, inner: 0.05 },
} as const;
const UNICORN_SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.2.4/dist/unicornStudio.umd.js';
const PHONE_VIEWPORT_QUERY = '(max-width: 600px)';

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

function useStableViewportHeight(wrapperRef: RefObject<HTMLDivElement | null>): void {
  useEffect(() => {
    if (typeof window === 'undefined' || CSS.supports('height', '100lvh')) return;

    const applyStableHeight = () => {
      const height = Math.max(
        window.innerHeight,
        window.visualViewport?.height ?? 0,
      );
      wrapperRef.current?.style.setProperty('--unicorn-stable-vh', `${height}px`);
    };

    applyStableHeight();
    window.addEventListener('orientationchange', applyStableHeight);
    return () => {
      window.removeEventListener('orientationchange', applyStableHeight);
    };
  }, [wrapperRef]);
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
  theme: UnicornTheme;
  surface: ShaderSurface;
  paused?: boolean;
  isVisible?: boolean;
}

export function UnicornBackground({
  projectId,
  theme,
  surface,
  paused = false,
  isVisible = true,
}: UnicornBackgroundProps) {
  const shouldRender = useShouldRender();
  const isPhoneViewport = useIsPhoneViewport();
  const [loadedSceneKey, setLoadedSceneKey] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<UnicornSceneInstance | null>(null);
  const activeSceneKeyRef = useRef<string | null>(null);
  useStableViewportHeight(wrapperRef);
  const themeRef = useRef(theme);
  const reactId = useId();
  const containerId = `unicorn-bg-${reactId.replace(/:/g, '')}`;
  const targetOpacity = SHADER_OPACITY[theme][surface];
  const sceneDpi = isPhoneViewport ? 1 : 1.5;
  const sceneFps = isPhoneViewport ? 30 : 60;
  const sceneKey = `${projectId}:${sceneDpi}:${sceneFps}`;
  const visibleOpacity = loadedSceneKey === sceneKey && isVisible ? targetOpacity : 0;

  themeRef.current = theme;

  const initScene = useCallback(() => {
    if (!shouldRender || !window.UnicornStudio) return;
    if (activeSceneKeyRef.current === sceneKey) return;

    sceneRef.current?.destroy();
    sceneRef.current = null;
    activeSceneKeyRef.current = sceneKey;

    const initialTheme = themeRef.current;

    window.UnicornStudio.addScene({
      elementId: containerId,
      projectId,
      initialPreset: getThemePreset(initialTheme),
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
        applyUnicornTheme(scene, themeRef.current);
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

  useEffect(() => {
    if (!sceneRef.current || loadedSceneKey !== sceneKey) return;
    applyUnicornTheme(sceneRef.current, theme);
  }, [theme, loadedSceneKey, sceneKey]);

  if (!shouldRender) return null;

  return (
    <>
      <Script src={UNICORN_SDK_URL} strategy="afterInteractive" onLoad={initScene} />
      <div ref={wrapperRef} className={styles.wrapper} style={{ opacity: visibleOpacity }}>
        <div id={containerId} style={{ width: '100%', height: '100%' }} />
      </div>
    </>
  );
}
