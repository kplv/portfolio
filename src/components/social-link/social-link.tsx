'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import styles from './social-link.module.css';

export interface SocialLinkProps {
  href: string;
  text: string;
}

export function SocialLink({ href, text }: SocialLinkProps) {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              opacity: 0.7,
              transition: {
                duration: 0.15,
                ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
              },
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: 0.97,
              transition: {
                duration: 0.1,
                ease: [0.23, 1, 0.32, 1] as [number, number, number, number],
              },
            }
      }
    >
      {text}
      <motion.span
        className={styles.underline}
        initial={{ scaleX: 0 }}
        animate={
          shouldReduceMotion
            ? { scaleX: isHovered ? 1 : 0 }
            : {
                scaleX: isHovered ? 1 : 0,
                transition: {
                  type: 'spring',
                  duration: 0.3,
                  bounce: 0.1,
                },
              }
        }
      />
    </motion.a>
  );
}
