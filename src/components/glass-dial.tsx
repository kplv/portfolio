'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useDialKit, type DialConfig } from 'dialkit';

/**
 * Dev-only tuning for the frosted glass buttons (Go Back, theme toggle, resume card).
 *
 *   back       — % of the page background color in the fill (rest + hover)
 *   tint       — % of the element's own icon/text color at rest
 *   tintHover  — % of the element's own icon/text color on hover / press
 *
 * Defaults match `src/app/tokens.css`. Values are set inline on <html> only in
 * development; copy final values back into tokens.css.
 */
const glassDialConfig = {
  light: {
    back: [10, 0, 100, 1],
    tint: [0, 0, 30, 0.5],
    tintHover: [5, 0, 30, 0.5],
  },
  dark: {
    back: [15, 0, 100, 1],
    tint: [2, 0, 30, 0.5],
    tintHover: [10, 0, 30, 0.5],
  },
} satisfies DialConfig;

const IS_DEV = process.env.NODE_ENV !== 'production';

export function GlassDial() {
  const values = useDialKit('Glass button', glassDialConfig);
  const { resolvedTheme } = useTheme();
  const { back, tint, tintHover } = values[resolvedTheme === 'dark' ? 'dark' : 'light'];

  useEffect(() => {
    if (!IS_DEV) return;
    const root = document.documentElement;
    root.style.setProperty('--glass-back', `${back}%`);
    root.style.setProperty('--glass-tint', `${tint}%`);
    root.style.setProperty('--glass-tint-hover', `${tintHover}%`);
    return () => {
      root.style.removeProperty('--glass-back');
      root.style.removeProperty('--glass-tint');
      root.style.removeProperty('--glass-tint-hover');
    };
  }, [back, tint, tintHover]);

  return null;
}
