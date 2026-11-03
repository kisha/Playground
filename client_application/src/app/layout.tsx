import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { brand } from "@/content/brand";
import { cn } from "@/lib/utils";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// For the Tulip style on the App Shell example, so no page preloads them.
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", preload: false });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", preload: false });

export const metadata: Metadata = {
  // Pages set only their own title, e.g. "Sandbox", which becomes "Sandbox · Playground".
  title: { default: brand.name, template: `%s · ${brand.name}` },
  description: brand.tagline,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // next-themes sets the theme class on <html> before React hydrates.
    <html lang="en" className={cn("font-sans antialiased", inter.variable, geist.variable, geistMono.variable)} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
