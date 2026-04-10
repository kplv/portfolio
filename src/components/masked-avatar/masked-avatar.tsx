'use client';

import { useState } from 'react';
import Image, { type StaticImageData } from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { EASE_OUT_QUINT, PRESS_DURATION, PRESS_SCALE } from '@/config/animations';
import styles from './masked-avatar.module.css';

/** Stroke path from Figma mask (node 356:2723), aligned to viewBox 0 0 174.335 174.335 */
const MASK_BORDER_PATH =
  'M71.0796 8.29449C79.2873 -2.09817 95.0478 -2.09817 103.255 8.29449L107.378 13.5152C111.576 18.83 118.23 21.5866 124.957 20.7964L131.563 20.0201C144.716 18.4749 155.86 29.6194 154.315 42.772L153.539 49.3785C152.748 56.1047 155.505 62.7591 160.82 66.9566L166.041 71.0796C176.433 79.2873 176.433 95.0478 166.041 103.255L160.82 107.378C155.505 111.576 152.748 118.23 153.539 124.957L154.315 131.563C155.86 144.716 144.716 155.86 131.563 154.315L124.957 153.539C118.23 152.748 111.576 155.505 107.378 160.82L103.255 166.041C95.0478 176.433 79.2873 176.433 71.0796 166.041L66.9566 160.82C62.7591 155.505 56.1047 152.748 49.3785 153.539L42.772 154.315C29.6194 155.86 18.4749 144.716 20.0201 131.563L20.7964 124.957C21.5866 118.23 18.83 111.576 13.5152 107.378L8.29449 103.255C-2.09817 95.0478 -2.09817 79.2873 8.29449 71.0796L13.5152 66.9566C18.83 62.7591 21.5866 56.1047 20.7964 49.3785L20.0201 42.772C18.4749 29.6194 29.6194 18.4749 42.772 20.0201L49.3785 20.7964C56.1047 21.5866 62.7591 18.83 66.9566 13.5152L71.0796 8.29449Z';

const DEFAULT_SIZE = 172;
const MASK_VIEWBOX = '0 0 174.335 174.335';

export interface MaskedAvatarProps {
  src: string | StaticImageData;
  size?: number;
}

export function MaskedAvatar({ src, size = DEFAULT_SIZE }: MaskedAvatarProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const dim = { width: size, height: size };
  const sizesAttr = `${size}px`;

  return (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-label="Denis Kopylov"
      className={styles.root}
      style={dim}
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: PRESS_SCALE,
              transition: {
                duration: PRESS_DURATION,
                ease: EASE_OUT_QUINT,
              },
            }
      }
    >
      <div className={styles.stack}>
        <div className={styles.rotateLayer}>
          <span
            className={styles.skeleton}
            aria-hidden
            data-loaded={isLoaded}
          />
          <div className={styles.maskedClip}>
            <div className={styles.imageInner}>
              <Image
                src={src}
                alt=""
                fill
                sizes={sizesAttr}
                draggable={false}
                className={styles.image}
                data-loaded={isLoaded}
                onLoad={() => setIsLoaded(true)}
                priority={false}
                quality={90}
              />
            </div>
          </div>
          <svg
            className={styles.borderSvg}
            viewBox={MASK_VIEWBOX}
            aria-hidden
          >
            <path
              className={styles.borderPath}
              d={MASK_BORDER_PATH}
              fill="none"
              strokeWidth={2}
              vectorEffect="nonScalingStroke"
            />
          </svg>
        </div>
      </div>
    </motion.button>
  );
}
