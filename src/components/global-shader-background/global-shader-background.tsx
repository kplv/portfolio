'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { UnicornBackground } from '@/components/unicorn-background';
import { getProjectByPathname, projects } from '@/data/projects';

export function GlobalShaderBackground() {
  const pathname = usePathname();
  const { resolvedTheme } = useTheme();

  const projectFromRoute = useMemo(
    () => getProjectByPathname(pathname, projects),
    [pathname],
  );

  const isAbout = pathname === '/about';
  const isHome = pathname === '/';
  const isProject = projectFromRoute != null;
  const showNavPadding = isHome || isAbout || isProject;

  const themeReady = resolvedTheme === 'light' || resolvedTheme === 'dark';
  const isLightTheme = resolvedTheme === 'light';

  if (!showNavPadding) {
    return null;
  }

  return (
    <UnicornBackground isVisible={themeReady && isLightTheme} />
  );
}
