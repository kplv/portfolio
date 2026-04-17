'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { DocumentLink } from '@/components/document-link';
import { MaskedAvatar } from '@/components/masked-avatar';
import styles from './cards-horizontall-view.module.css';

const SNAPPY_SPRING = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 15,
  mass: 0.55,
};

export interface CardsHorizontallViewProps {
  avatarSrc: string;
  documentSrc: string;
  downloadFileName: string;
  className?: string;
}

export function CardsHorizontallView({
  avatarSrc,
  documentSrc,
  downloadFileName,
  className,
}: CardsHorizontallViewProps) {
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
          transition={shouldReduceMotion ? { duration: 0 } : SNAPPY_SPRING}
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
          transition={shouldReduceMotion ? { duration: 0 } : SNAPPY_SPRING}
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
          <DocumentLink
            src={documentSrc}
            downloadFileName={downloadFileName}
          />
        </motion.div>
      </div>
    </div>
  );
}
