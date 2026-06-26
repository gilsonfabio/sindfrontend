"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

type Attribute = "class" | "data-theme" | Array<"class" | "data-theme">;

interface ThemeProviderProps {
  attribute?: Attribute;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  children: React.ReactNode;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
