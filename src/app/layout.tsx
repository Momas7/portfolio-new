import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  description:
    "Portfólio de Lucas — Desenvolvedor Full Stack apaixonado por criar experiências digitais elegantes, funcionais e automatizar processos.",
  keywords: ["desenvolvedor", "full stack", "react", "next.js", "portfolio"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${display.variable} ${mono.variable}`}
    >
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {`${themeInitScript};try{if(localStorage.getItem('lang')==='en')document.documentElement.lang='en'}catch(e){}`}
        </Script>
        {children}
      </body>
    </html>
  );
}
