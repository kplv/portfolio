'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DocumentLink } from '@/components/document-link';
import { MaskedAvatar } from '@/components/masked-avatar';
import { SPRING_ROUTE_CONTENT } from '@/config/animations';
import styles from './cards-horizontall-view.module.css';

type CardsHorizontallViewPdfProps = {
  avatarSrc: string;
  className?: string;
  documentSrc: string;
  downloadFileName: string;
};

type CardsHorizontallViewNavigateProps = {
  avatarSrc: string;
  className?: string;
  /** Document tile navigates in-app (e.g. `/#about`) instead of downloading the PDF */
  documentNavigateTo: string;
};

export type CardsHorizontallViewProps =
  | CardsHorizontallViewPdfProps
  | CardsHorizontallViewNavigateProps;

export function CardsHorizontallView(props: CardsHorizontallViewProps) {
  const { avatarSrc, className } = props;
  const shouldReduceMotion = useReducedMotion();
  const [isDocumentHovered, setIsDocumentHovered] = useState(false);
  const [isDocumentFocusVisible, setIsDocumentFocusVisible] = useState(false);
  const [isAvatarHovered, setIsAvatarHovered] = useState(false);

  const isDocumentActive = isDocumentHovered || isDocumentFocusVisible;
  const documentScale = shouldReduceMotion ? 1 : isDocumentActive ? 1.1 : 1;
  const avatarScale = shouldReduceMotion ? 1 : isAvatarHovered ? 1.1 : 1;

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.cardsRow}>
        <motion.div
          className={styles.avatarItem}
          animate={{
            scale: avatarScale,
            zIndex: isDocumentActive ? 1 : 2,
          }}
          transition={
            shouldReduceMotion ? { duration: 0 } : SPRING_ROUTE_CONTENT
          }
          onHoverStart={() => setIsAvatarHovered(true)}
          onHoverEnd={() => setIsAvatarHovered(false)}
        >
          <MaskedAvatar src={avatarSrc} size={164} />
        </motion.div>

        <motion.div
          className={styles.documentItem}
          animate={{
            scale: documentScale,
            rotate: isDocumentHovered ? -2 : -7,
            zIndex: isDocumentActive ? 3 : 1,
          }}
          transition={
            shouldReduceMotion ? { duration: 0 } : SPRING_ROUTE_CONTENT
          }
          onHoverStart={() => setIsDocumentHovered(true)}
          onHoverEnd={() => setIsDocumentHovered(false)}
          onFocusCapture={(event) => {
            const target = event.target;
            if (target instanceof HTMLElement && target.matches(':focus-visible')) {
              setIsDocumentFocusVisible(true);
            }
          }}
          onBlurCapture={() => {
            setIsDocumentFocusVisible(false);
          }}
        >
          {'documentNavigateTo' in props ? (
            <DocumentLink
              mode="navigate"
              href={props.documentNavigateTo}
              label="About"
            />
          ) : (
            <DocumentLink
              src={props.documentSrc}
              downloadFileName={props.downloadFileName}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
