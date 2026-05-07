'use client';

import dynamic from 'next/dynamic';
import 'dialkit/styles.css';

const DevDialRoot = dynamic(
  () => import('dialkit').then((m) => m.DialRoot),
  { ssr: false },
);

export function DialTools() {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }
  return (
    <DevDialRoot position="bottom-right" defaultOpen={false} theme="system" />
  );
}
