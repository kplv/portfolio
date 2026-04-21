'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  UnicornBackground,
  UNICORN_PROJECT_ID_DARK,
  UNICORN_PROJECT_ID_LIGHT,
} from '@/components/unicorn-background';
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
  const projectId =
    resolvedTheme === 'dark' ? UNICORN_PROJECT_ID_DARK : UNICORN_PROJECT_ID_LIGHT;

  if (!showNavPadding) {
    return null;
  }

  return (
    <UnicornBackground
      projectId={projectId}
      isVisible={themeReady}
    />
  );
}
