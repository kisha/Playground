"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/** Light and dark mode: follows the operating system until the user picks one. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}
