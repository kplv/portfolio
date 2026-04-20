'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import {
  EASE_OUT_QUINT,
  PRESS_DURATION,
  PRESS_SCALE,
} from '@/config/animations';
import styles from './document-link.module.css';

const BORDER_VIEWBOX = '0 0 120 160';

function downloadAttributeValue(baseName: string): string {
  const t = baseName.trim();
  if (/\.pdf$/i.test(t)) return t;
  return `${t}.pdf`;
}

function formatMb(bytes: number, locale: string): string {
  const mb = bytes / (1024 * 1024);
  const n = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(mb);
  return `${n} MB`;
}

type DownloadDocumentLinkProps = {
  mode?: 'download';
  src: string;
  downloadFileName: string;
  label?: string;
  className?: string;
};

type NavigateDocumentLinkProps = {
  mode: 'navigate';
  href: string;
  label: string;
  className?: string;
};

export type DocumentLinkProps = DownloadDocumentLinkProps | NavigateDocumentLinkProps;

function DocumentCardBody({
  label,
  sizeLine,
}: {
  label: string;
  sizeLine?: string;
}) {
  return (
    <span className={styles.float}>
      <span className={styles.card}>
        <svg
          className={styles.borderSvg}
          viewBox={BORDER_VIEWBOX}
          aria-hidden
        >
          <rect
            className={styles.borderPath}
            x={1}
            y={1}
            width={118}
            height={158}
            rx={16}
            ry={16}
            fill="none"
            strokeWidth={2}
            vectorEffect="nonScalingStroke"
          />
        </svg>
        <div className={styles.body}>
          <div className={styles.topSlot}>
            <div className={styles.linesColumn}>
              <div
                className={styles.line}
                style={{ width: 76 }}
                aria-hidden
              />
              <div
                className={styles.line}
                style={{ width: 40 }}
                aria-hidden
              />
              <div
                className={styles.line}
                style={{ width: 60 }}
                aria-hidden
              />
            </div>
          </div>
          <div className={styles.textBlock}>
            <p className={styles.title}>{label}</p>
            {sizeLine !== undefined ? (
              <p className={styles.sizeLine}>{sizeLine}</p>
            ) : null}
          </div>
        </div>
      </span>
    </span>
  );
}

export function DocumentLink(props: DocumentLinkProps) {
  const shouldReduceMotion = useReducedMotion();

  if (props.mode === 'navigate') {
    const { href, label, className } = props;
    const scroll = !href.includes('#');
    return (
      <Link
        href={href}
        className={[styles.root, className].filter(Boolean).join(' ')}
        aria-label={label}
        scroll={scroll}
      >
        <motion.span
          className={styles.motionTap}
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
          <DocumentCardBody label={label} />
        </motion.span>
      </Link>
    );
  }

  const {
    src,
    downloadFileName,
    label = 'Resume',
    className,
  } = props;

  const [sizeBytes, setSizeBytes] = useState<number | null>(null);

  const href = encodeURI(src);
  const downloadName = downloadAttributeValue(downloadFileName);

  const locale =
    typeof globalThis !== 'undefined' && 'navigator' in globalThis
      ? globalThis.navigator.language
      : 'en';

  const sizeLine =
    sizeBytes !== null ? formatMb(sizeBytes, locale) : '1 MB';

  const ariaLabel =
    sizeBytes !== null
      ? `Download ${label} (PDF, ${formatMb(sizeBytes, locale)})`
      : `Download ${label} (PDF, ${sizeLine})`;

  useEffect(() => {
    let cancelled = false;

    async function loadSize() {
      try {
        const headRes = await fetch(src, {
          method: 'HEAD',
          cache: 'force-cache',
        });
        const len = headRes.headers.get('Content-Length');
        if (len && headRes.ok) {
          const bytes = parseInt(len, 10);
          if (!cancelled && Number.isFinite(bytes)) {
            setSizeBytes(bytes);
            return;
          }
        }
        const getRes = await fetch(src, { method: 'GET', cache: 'force-cache' });
        const buf = await getRes.arrayBuffer();
        if (!cancelled) setSizeBytes(buf.byteLength);
      } catch {
        /* keep placeholder size */
      }
    }

    loadSize();
    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <motion.a
      href={href}
      download={downloadName}
      className={[styles.root, className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
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
      <DocumentCardBody label={label} sizeLine={sizeLine} />
    </motion.a>
  );
}
