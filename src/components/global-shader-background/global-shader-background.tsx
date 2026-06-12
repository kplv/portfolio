'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { UnicornBackground } from '@/components/unicorn-background';

const UNICORN_PROJECT_ID = 'uTQ3D3yXA9AulHhPqku2';

export function GlobalShaderBackground() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const isAbout = pathname === '/about';
  const isHome = pathname === '/';
  const segments = pathname.split('/').filter(Boolean);
  const isProjectPage = segments.length === 1 && segments[0] !== 'about';
  const showUnicornBackground = isHome || isAbout || isProjectPage;

  const themeReady = resolvedTheme === 'light' || resolvedTheme === 'dark';
  if (!showUnicornBackground || !themeReady) {
    return null;
  }

  const surface = isHome || isAbout ? 'home' : 'inner';

  return (
    <UnicornBackground
      projectId={UNICORN_PROJECT_ID}
      theme={resolvedTheme}
      surface={surface}
      isVisible={themeReady}
    />
  );
}
