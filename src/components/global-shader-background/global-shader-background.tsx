'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { UnicornBackground } from '@/components/unicorn-background';

export function GlobalShaderBackground() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const isAbout = pathname === '/about';
  const isHome = pathname === '/';
  const showUnicornBackground = isHome || isAbout;

  const themeReady = resolvedTheme === 'light' || resolvedTheme === 'dark';
  const isLightTheme = resolvedTheme === 'light';

  if (!showUnicornBackground) {
    return null;
  }

  return (
    <UnicornBackground isVisible={themeReady && isLightTheme} />
  );
}
