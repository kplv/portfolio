import { Suspense } from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { abcFavorit, hagrid } from "./fonts";
import { GlobalShaderBackground } from "@/components/global-shader-background";
import { YandexMetrica } from "@/components/yandex-metrica/yandex-metrica";

export const metadata: Metadata = {
  title: "Denis Kopylov — Product Designer",
  description: "Senior product designer with over 8 years of experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${abcFavorit.variable} ${hagrid.variable}`}>
      <body>
        <Suspense fallback={null}>
          <YandexMetrica />
        </Suspense>
        <Providers>
          <GlobalShaderBackground />
          {children}
        </Providers>
      </body>
    </html>
  );
}
