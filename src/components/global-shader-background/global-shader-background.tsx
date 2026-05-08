'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { UnicornBackground } from '@/components/unicorn-background';

export function GlobalShaderBackground() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const isAbout = pathname === '/about';
  const isHome = pathname === '/';
  const segments = pathname.split('/').filter(Boolean);
  const isProjectPage = segments.length === 1 && segments[0] !== 'about';
  const showUnicornBackground = isHome || isAbout || isProjectPage;

  const themeReady = resolvedTheme === 'light' || resolvedTheme === 'dark';
  const isLightTheme = resolvedTheme === 'light';

  if (!showUnicornBackground) {
    return null;
  }

  const surface = isHome || isAbout ? 'home' : 'inner';

  return (
    <UnicornBackground
      surface={surface}
      isVisible={themeReady && isLightTheme}
    />
  );
}
