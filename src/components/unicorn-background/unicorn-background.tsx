'use client';

import { useState, useEffect, useRef, useCallback, useId } from 'react';
import Script from 'next/script';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT_QUINT } from '@/config/animations';
import styles from './unicorn-background.module.css';

const SDK_URL =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.4/dist/unicornStudio.umd.js';

const LEGACY_PROJECT_ID = 'ssf4XIrdYQTi8HGovdhZ';

function useShouldRender(): boolean {
  const reducedMotion = useReducedMotion();
  const [capable, setCapable] = useState(false);

  useEffect(() => {
    setCapable(navigator.hardwareConcurrency >= 4);
  }, []);

  return !reducedMotion && capable;
}

interface UnicornBackgroundProps {
  paused?: boolean;
  isVisible?: boolean;
}

export function UnicornBackground({
  paused = false,
  isVisible = true,
}: UnicornBackgroundProps) {
  const shouldRender = useShouldRender();
  const [loaded, setLoaded] = useState(false);
  const sceneRef = useRef<UnicornScene | null>(null);
  const reactId = useId();
  const containerId = `unicorn-bg-${reactId.replace(/:/g, '')}`;
  const initCalled = useRef(false);

  const initScene = useCallback(() => {
    if (initCalled.current || !window.UnicornStudio) return;
    initCalled.current = true;

    window.UnicornStudio.addScene({
      elementId: containerId,
      projectId: LEGACY_PROJECT_ID,
      scale: 1,
      dpi: 1.5,
      fps: 60,
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
  }, [containerId]);

  useEffect(() => {
    if (!shouldRender) return;
    if (window.UnicornStudio) {
      initScene();
    }
  }, [shouldRender, initScene]);

  useEffect(() => {
    return () => {
      sceneRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.paused = paused;
    }
  }, [paused]);

  if (!shouldRender) return null;

  return (
    <>
      <Script src={SDK_URL} strategy="afterInteractive" onLoad={initScene} />
      <motion.div
        className={styles.wrapper}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? (isVisible ? 0.4 : 0) : 0 }}
        transition={{ duration: 0.5, ease: EASE_OUT_QUINT }}
      >
        <div id={containerId} style={{ width: '100%', height: '100%' }} />
      </motion.div>
    </>
  );
}
