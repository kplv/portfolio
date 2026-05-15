'use client';

import { CalendarIcon } from '@/components/icons/calendar-icon';
import styles from './year-tag.module.css';

export interface YearTagProps {
  year: string;
}

export function YearTag({ year }: YearTagProps) {
  return (
    <div className={styles.root}>
      <CalendarIcon size={20} />
      <span className={styles.year}>{year}</span>
    </div>
  );
}
