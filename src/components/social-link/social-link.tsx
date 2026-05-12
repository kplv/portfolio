'use client';

import { motion, useReducedMotion } from 'motion/react';
import Link from 'next/link';
import { type ReactNode, useMemo } from 'react';
import { useMotionTokens } from '@/config/motion-tokens';
import { getAccentTextStyle } from '@/data/projects';
import styles from './social-link.module.css';

const DEFAULT_SOCIAL_ACCENT = 'var(--text-display-gradient)';

export interface SocialLinkProps {
  href: string;
  text: string;
  icon?: ReactNode;
  /** CSS color or gradient (e.g. display token). Defaults to `--text-display-gradient`. */
  accent?: string;
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

const MotionLink = motion.create(Link);

export function SocialLink({ href, text, icon, accent }: SocialLinkProps) {
  const shouldReduceMotion = useReducedMotion();
  const tokens = useMotionTokens();
  const external = isExternalHref(href);
  const LinkComponent = external ? motion.a : MotionLink;
  const fill = accent ?? DEFAULT_SOCIAL_ACCENT;
  const labelStyle = useMemo(() => getAccentTextStyle(fill), [fill]);

  return (
    <LinkComponent
      href={href}
      {...(external
        ? { target: '_blank' as const, rel: 'noopener noreferrer' }
        : {})}
      className={styles.link}
      whileHover={
        shouldReduceMotion
          ? undefined
          : {
              opacity: tokens.link.hoverOpacity,
              transition: tokens.link.hoverSpring,
            }
      }
      whileTap={
        shouldReduceMotion
          ? undefined
          : {
              scale: tokens.interactiveTap.scale,
              transition: tokens.interactiveTap.spring,
            }
      }
    >
      {icon ? (
        <span className={styles.icon} aria-hidden>
          {icon}
        </span>
      ) : null}
      <span className={styles.label} style={labelStyle}>
        {text}
      </span>
      {/*
        TODO(social-link): line/underline hover animation temporarily disabled.
        Re-enable once we've finalized the icon + label hover treatment.
        When uncommenting, restore: useState for isHovered, onHoverStart/onHoverEnd
        on LinkComponent, and pass shouldReduceMotion + tokens into animate below.

      <motion.span
        className={styles.underline}
        initial={{ scaleX: 0 }}
        animate={
          shouldReduceMotion
            ? { scaleX: isHovered ? 1 : 0 }
            : {
                scaleX: isHovered ? 1 : 0,
                transition: tokens.link.underlineSpring,
              }
        }
      />
      */}
    </LinkComponent>
  );
}
