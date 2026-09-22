import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Provider } from "@/components/ui/provider";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lucas | Desenvolvedor Full Stack",
  description:
    "Portfólio de Lucas — Desenvolvedor Full Stack apaixonado por criar experiências digitais elegantes, funcionais e automatizar processos.",
  keywords: ["desenvolvedor", "full stack", "react", "next.js", "portfolio"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body
        style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
        }}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider>{children}</Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
