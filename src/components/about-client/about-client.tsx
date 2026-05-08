'use client';

import { motion, useReducedMotion } from 'motion/react';
import { CardsHorizontallView } from '@/components/cards-horizontall-view';
import { ROUTE_SECTION_REDUCED_MOTION_TARGET } from '@/config/page-motion';
import { useOrderedRouteSectionVariants } from '@/hooks/use-ordered-route-section-variants';
import styles from './about-client.module.css';

/**
 * About column (cards + copy) for use inside the shared shell.
 */
export function AboutSectionContent() {
  const shouldReduceMotion = useReducedMotion();
  const sectionVariants = useOrderedRouteSectionVariants();
  const reducedState = ROUTE_SECTION_REDUCED_MOTION_TARGET;

  return (
    <>
      <motion.div
        className={styles.cardsWrap}
        variants={sectionVariants}
        custom={{ enterOrder: 0, exitOrder: 1 }}
        initial={shouldReduceMotion ? reducedState : 'hidden'}
        animate={shouldReduceMotion ? reducedState : 'show'}
        exit={shouldReduceMotion ? reducedState : 'exit'}
      >
        <CardsHorizontallView
          avatarSrc="/images/denis-image.png"
          documentSrc="/Denis Kopylov-CV.pdf"
          downloadFileName="Denis Kopylov, Sr. Product Designer"
        />
      </motion.div>
      <motion.div
        className={styles.copy}
        variants={sectionVariants}
        custom={{ enterOrder: 1, exitOrder: 0 }}
        initial={shouldReduceMotion ? reducedState : 'hidden'}
        animate={shouldReduceMotion ? reducedState : 'show'}
        exit={shouldReduceMotion ? reducedState : 'exit'}
      >
        <p className={styles.paragraph}>
          Hey! I’m Denis, a product designer with focus on interaction design.
        </p>
        <p className={styles.paragraph}>
          A fan of Bauhaus, and then of Ulm School of Design — I approach work holistically.
          Design is a practice, where command of form, colour, and material are essential. So I           code, but pay respect to design and art books. I believe, great results come from synergy of
          disciplines and building on top of others’ work.
        </p>
        <p className={styles.paragraph}>
          Apart from looking at screen, I spend my time dancing contemporary or riding a Fuji
          Feather across Schöneberg, Berlin.{' '}
        </p>
      </motion.div>
    </>
  );
}
