'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'motion/react';
import type { MediaBlock } from '@/data/projects';
import { MediaLabel } from '@/components/project/media-label';
import styles from './media-block.module.css';

export interface ProjectMediaBlockProps {
  /** Body paragraph when there is no media */
  text?: string;
  media?: MediaBlock | MediaBlock[];
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
      <div className={cover ? styles.frameCover : styles.frame}>
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
  scale,
}: {
  src: string;
  poster?: string;
  loop?: boolean;
  cover?: boolean;
  scale?: number;
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
      video.play().catch(() => { });
    }
  }, [inView, loop, shouldReduceMotion]);

  return (
    <div ref={containerRef} className={cover ? styles.frameCover : styles.frame}>
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
        data-scaled={scale ? true : undefined}
        style={scale ? ({ '--video-scale': scale } as CSSProperties) : undefined}
        onCanPlay={() => setIsLoaded(true)}
      />
    </div>
  );
}

export function ProjectMediaBlock({ text, media, accentColor }: ProjectMediaBlockProps) {
  const items = media ? (Array.isArray(media) ? media : [media]) : [];
  const isGallery = items.length > 1;
  const total = items.length;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [media]);

  const active = items[index];
  const caption = active?.label ?? text;
  const showMediaLabel = isGallery || Boolean(caption);

  const galleryHandlers = isGallery
    ? {
        current: index + 1,
        total,
        onPrev: () => setIndex((i) => (i - 1 + total) % total),
        onNext: () => setIndex((i) => (i + 1) % total),
      }
    : {};

  return (
    <div
      className={styles.block}
      style={{ '--media-accent-color': accentColor } as CSSProperties}
    >
      {active && (
        <div
          key={isGallery ? `gallery-${index}` : 'single'}
          className={styles.container}
          data-cover={active.cover || undefined}
        >
          {active.type === 'image' ? (
            <ProjectImage
              src={active.src}
              alt={active.alt ?? active.label ?? ''}
              cover={active.cover}
            />
          ) : (
            <ProjectVideo
              src={active.src}
              poster={active.poster}
              loop={active.loop}
              cover={active.cover}
              scale={active.scale}
            />
          )}
        </div>
      )}
      {showMediaLabel && (
        <MediaLabel
          label={caption}
          color={accentColor}
          {...galleryHandlers}
        />
      )}
    </div>
  );
}
