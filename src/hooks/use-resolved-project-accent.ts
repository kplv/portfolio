'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import type { Project } from '@/data/projects';
import { getResolvedAccent } from '@/data/projects';

/** Resolved `accent` / `accentDark` for the current theme (defaults to light until mounted). */
export function useResolvedProjectAccent(project: Project): string {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setMounted(true));
  }, []);

  const theme = mounted && resolvedTheme === 'dark' ? 'dark' : 'light';
  return getResolvedAccent(project, theme);
}
