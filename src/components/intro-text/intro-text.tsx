'use client';

import { useEffect, useRef } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';
import styles from './intro-text.module.css';

export interface IntroTextProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  header: string;
  text: string;
  /** Solid accent color for header when no gradient */
  color?: string;
  /** Gradient for header; takes precedence over color when provided */
  gradient?: string;
}

export function IntroText({
  header,
  text,
  color,
  gradient,
  className,
  ...motionProps
}: IntroTextProps) {
  const headerRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    // #region agent log
    fetch('http://127.0.0.1:7364/ingest/a524ac81-addc-48b2-b5df-5bc6c74adf3c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d9fc50'},body:JSON.stringify({sessionId:'d9fc50',runId:'pre-fix',hypothesisId:'H1',location:'intro-text.tsx:27',message:'IntroText props on render',data:{header,hasGradient:Boolean(gradient),gradientValue:gradient ?? null,hasColor:Boolean(color)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion

    const el = headerRef.current;
    if (!el) return;
    const cs = window.getComputedStyle(el);
    // #region agent log
    fetch('http://127.0.0.1:7364/ingest/a524ac81-addc-48b2-b5df-5bc6c74adf3c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'d9fc50'},body:JSON.stringify({sessionId:'d9fc50',runId:'pre-fix',hypothesisId:'H2',location:'intro-text.tsx:34',message:'Computed heading styles',data:{header,color:cs.color,backgroundImage:cs.backgroundImage,backgroundClip:(cs as CSSStyleDeclaration).backgroundClip,webkitBackgroundClip:(cs as CSSStyleDeclaration).webkitBackgroundClip,webkitTextFillColor:(cs as CSSStyleDeclaration).webkitTextFillColor},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }, [header, gradient, color]);

  const headerStyle: React.CSSProperties | undefined =
    gradient
      ? {
          backgroundImage: gradient,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          WebkitTextFillColor: 'transparent',
        }
      : color
        ? { color }
        : undefined;

  return (
    <motion.div
      {...motionProps}
      className={[styles.container, className].filter(Boolean).join(' ')}
    >
      <h1
        ref={headerRef}
        className={styles.header}
        {...(headerStyle && { style: headerStyle })}
      >
        {header}
      </h1>
      <p className={styles.text}>{text}</p>
    </motion.div>
  );
}
