import type { Metadata } from 'next';
import { AboutClient } from '@/components/about-client/about-client';
import styles from '../page.module.css';

export const metadata: Metadata = {
  title: 'About — Denis Kopylov',
  description:
    'Product designer with a focus on interaction design — Bauhaus, Ulm School, and holistic practice.',
};

export default function AboutPage() {
  return <AboutClient className={styles.content} />;
}
