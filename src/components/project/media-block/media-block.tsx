'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import type { MediaBlock } from '@/data/projects';
import styles from './media-block.module.css';

export interface ProjectMediaBlockProps {
  label?: string;
  media: MediaBlock;
  accentColor: string;
}

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

function ProjectImage({ src, alt, cover }: { src: string; alt: string; cover?: boolean }) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <span className={styles.skeleton} data-loaded={isLoaded} aria-hidden="true" />
      <div className={cover ? styles.imageFrameCover : styles.imageFrame}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 428px) 100vw, 50vw"
          quality={90}
          unoptimized
          className={styles.media}
          data-loaded={isLoaded}
          data-cover={cover || undefined}
          onLoad={() => setIsLoaded(true)}
        />
      </div>
    </>
  );
}

function ProjectVideo({
  src,
  poster,
  loop = true,
  cover,
}: {
  src: string;
  poster?: string;
  loop?: boolean;
  cover?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(containerRef as React.RefObject<HTMLElement | null>);
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!inView || !video) return;
    video.preload = 'auto';
    if (loop && !shouldReduceMotion) {
      video.play().catch(() => {});
    }
  }, [inView, loop, shouldReduceMotion]);

  return (
    <div ref={containerRef} className={styles.videoWrapper}>
      <span className={styles.skeleton} data-loaded={isLoaded} aria-hidden="true" />
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload="none"
        muted
        playsInline
        loop={loop}
        className={styles.media}
        data-loaded={isLoaded}
        data-cover={cover || undefined}
        onCanPlay={() => setIsLoaded(true)}
      />
    </div>
  );
}

export function ProjectMediaBlock({ label, media, accentColor }: ProjectMediaBlockProps) {
  return (
    <div
      className={styles.block}
      style={{ '--media-accent-color': accentColor } as React.CSSProperties}
    >
      {label && (
        <div className={styles.header}>
          <p className={styles.label}>{label}</p>
        </div>
      )}
      <div className={styles.container} data-cover={media.cover || undefined}>
        {media.type === 'image' ? (
          <ProjectImage src={media.src} alt={media.alt ?? label ?? ''} cover={media.cover} />
        ) : (
          <ProjectVideo src={media.src} poster={media.poster} loop={media.loop} cover={media.cover} />
        )}
      </div>
    </div>
  );
}
