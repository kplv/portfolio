'use client';

import { ThemeProvider } from 'next-themes';
import { Agentation } from 'agentation';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <Agentation endpoint="http://localhost:4747" />
      )}
    </ThemeProvider>
  );
}
