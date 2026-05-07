'use client';

import { ThemeProvider } from 'next-themes';
import { DialTools } from '@/components/dial-tools';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
      <DialTools />
    </ThemeProvider>
  );
}
