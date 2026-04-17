'use client';

import { usePathname } from 'next/navigation';
import { motion, useReducedMotion } from 'motion/react';
import { SPRING_ROUTE_CONTENT } from '@/config/animations';

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const key = pathname ?? '';
  const animateRoutes = key === '/' || key === '/about';

  if (!animateRoutes) {
    return <>{children}</>;
  }

  if (shouldReduceMotion) {
    return <div style={{ minHeight: '100%' }}>{children}</div>;
  }

  return (
    <motion.div
      key={key}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={SPRING_ROUTE_CONTENT}
      style={{ minHeight: '100%' }}
    >
      {children}
    </motion.div>
  );
}
