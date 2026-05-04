'use client';

import {
  getAccentSolid,
  getAccentTextStyle,
  type SectionBlock,
} from '@/data/projects';
import { ProjectMediaBlock } from '@/components/project/media-block';
import styles from './section-block.module.css';

export interface SectionBlockViewProps {
  block: SectionBlock;
  /** Theme-resolved project accent (gradient or solid). */
  accent: string;
}

function normalizeParagraphs(text: string | string[]): string[] {
  return Array.isArray(text) ? text : [text];
}

export function SectionBlockView({ block, accent }: SectionBlockViewProps) {
  const accentSolid = getAccentSolid(accent);

  if (block.type === 'heading') {
    return (
      <h2 className={styles.heading} style={getAccentTextStyle(accent)}>
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
      accent={accent}
      accentSolid={accentSolid}
    />
  );
}
