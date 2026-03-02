'use client';

import { motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { ExternalLinkIcon } from '@/components/icons/external-link-icon';
import styles from './social-link.module.css';

export interface SocialLinkProps {
  href: string;
  text: string;
}

export function SocialLink({ href, text }: SocialLinkProps) {
  const shouldReduceMotion = useReducedMotion();
  const isExternal = href.startsWith('http') || href.startsWith('//');
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
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
      {/* <ExternalLinkIcon className={styles.icon} size={20} /> */}
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
