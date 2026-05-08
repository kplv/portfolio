'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { useMotionTokens } from '@/config/motion-tokens';
import styles from './avatar.module.css';

export interface AvatarProps {
  name: string;
  avatar: string;
  href: string;
  color: string;
  zIndex?: number;
}

export function Avatar({ name, avatar, href, color, zIndex }: AvatarProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const tokens = useMotionTokens();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={styles.avatar}
      style={{ '--avatar-color': color, zIndex } as React.CSSProperties}
      whileHover={
        shouldReduceMotion
          ? undefined
          : { scale: tokens.avatar.hoverScale, transition: tokens.avatar.hoverSpring }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : { scale: tokens.avatar.pressScale, transition: tokens.avatar.pressSpring }
      }
    >
      <span
        className={styles.skeleton}
        aria-hidden="true"
        data-loaded={isLoaded}
      />
      <Image
        src={avatar}
        alt={name}
        fill
        sizes="44px"
        unoptimized
        className={styles.image}
        data-loaded={isLoaded}
        onLoad={() => setIsLoaded(true)}
      />
    </motion.a>
  );
}
