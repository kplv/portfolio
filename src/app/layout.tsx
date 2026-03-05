import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { abcFavorit, gtSectra } from "./fonts";

export const metadata: Metadata = {
  title: "Denis Kopylov - Product Designer",
  description: "Senior product designer with over 8 years of experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${abcFavorit.variable} ${gtSectra.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
