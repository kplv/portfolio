'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { UnicornBackground } from '@/components/unicorn-background';

const LIGHT_UNICORN_PROJECT_ID = 'ssf4XIrdYQTi8HGovdhZ';
const DARK_UNICORN_PROJECT_ID = 'JAzw6Fbu8uELL8QT7zQM';

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
  const projectId =
    resolvedTheme === 'dark' ? DARK_UNICORN_PROJECT_ID : LIGHT_UNICORN_PROJECT_ID;

  return (
    <UnicornBackground
      projectId={projectId}
      surface={surface}
      isVisible={themeReady}
    />
  );
}
