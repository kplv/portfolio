'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import { SPRING_HOVER, SPRING_PRESS } from '@/config/animations';
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

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      className={styles.avatar}
      style={{ '--avatar-color': color, zIndex } as React.CSSProperties}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.15, transition: SPRING_HOVER }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.88, transition: SPRING_PRESS }}
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
