'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { useTheme } from 'next-themes';
import { CardsHorizontallView } from '@/components/cards-horizontall-view';
import { UnicornBackground } from '@/components/unicorn-background';
import { BLUR_ITEM, ENTRANCE_CONTAINER } from '@/config/animations';
import styles from './about-client.module.css';

export interface AboutClientProps {
  className?: string;
}

export function AboutClient({ className }: AboutClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const { resolvedTheme } = useTheme();
  const isLightTheme = resolvedTheme === 'light';

  return (
    <div className={styles.root}>
      <div className={styles.blurContext}>
        <motion.main className={className}>
          <motion.div
            className={styles.entranceContainer}
            variants={ENTRANCE_CONTAINER}
            initial={shouldReduceMotion ? false : 'hidden'}
            animate="show"
          >
            <motion.div className={styles.toolbar} variants={BLUR_ITEM}>
              <Link href="/" className={styles.goBack}>
                <span className={styles.goBackIcon} aria-hidden />
                <span className={styles.goBackLabel}>Go Back</span>
              </Link>
            </motion.div>
            <motion.div className={styles.cardsWrap} variants={BLUR_ITEM}>
              <CardsHorizontallView
                avatarSrc="/images/denis-image.png"
                documentSrc="/Denis Kopylov-CV.pdf"
                downloadFileName="Denis Kopylov, Sr. Product Designer"
              />
            </motion.div>
            <motion.div className={styles.copy} variants={BLUR_ITEM}>
              <p className={styles.paragraph}>
                <span>{`Hey, I’m `}</span>
                <span className={styles.accent}>Denis!</span>
                <span>{` I’m a product designer with focus on interaction design.`}</span>
              </p>
              <p className={styles.paragraph}>
                A fan of Bauhaus, and then of Ulm School of Design — I approach work
                holistically. Design is a practice, where command of form, colour, and
                material are essential. So I code, but pay respect to design and art
                books. Great results come from synergy of disciplines and building on
                top of others’ work.
              </p>
              <p className={styles.paragraph}>
                Apart from looking at screen, I spend my time dancing contemporary or
                riding a Fuji Feather across Schöneberg, Berlin.{' '}
              </p>
            </motion.div>
          </motion.div>
        </motion.main>
      </div>
      {!shouldReduceMotion && (
        <UnicornBackground paused={false} isVisible={isLightTheme} />
      )}
    </div>
  );
}
