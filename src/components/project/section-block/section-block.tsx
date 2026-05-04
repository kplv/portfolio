'use client';

import type { SectionBlock } from '@/data/projects';
import { ProjectMediaBlock } from '@/components/project/media-block';
import styles from './section-block.module.css';

export interface SectionBlockViewProps {
  block: SectionBlock;
  headerGradient: string;
  accentColor: string;
}

function normalizeParagraphs(text: string | string[]): string[] {
  return Array.isArray(text) ? text : [text];
}

export function SectionBlockView({
  block,
  headerGradient,
  accentColor,
}: SectionBlockViewProps) {
  if (block.type === 'heading') {
    return (
      <h2
        className={styles.heading}
        style={{
          backgroundImage: headerGradient,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
        }}
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === 'text') {
    const paragraphs = normalizeParagraphs(block.text);
    return (
      <div className={styles.textGroup}>
        {paragraphs.map((paragraph, i) => (
          <p key={i} className={styles.textParagraph}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  return (
    <ProjectMediaBlock
      media={block.media}
      accentColor={accentColor}
    />
  );
}
