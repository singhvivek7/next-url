"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { colorPalettes, ColorPalette, defaultPalette, themes } from "@/config/color-palettes";

type ThemeMode = 'light' | 'dark';

type ThemeColorContextType = {
  palette: ColorPalette;
  setPalette: (name: string) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
};

const ThemeColorContext = createContext<ThemeColorContextType | undefined>(undefined);

export function useThemeColor() {
  const context = useContext(ThemeColorContext);
  if (!context) {
    throw new Error("useThemeColor must be used within a ConfigStyleProvider");
  }
  return context;
}

export function ConfigStyleProvider({ children }: { children?: React.ReactNode }) {
  const [palette, setPaletteState] = useState<ColorPalette>(defaultPalette);
  const [mode, setModeState] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedPaletteName = localStorage.getItem("theme-palette");
    const savedMode = localStorage.getItem("theme-mode") as ThemeMode;

    if (savedPaletteName && colorPalettes[savedPaletteName]) {
      setPaletteState(colorPalettes[savedPaletteName]);
    }

    if (savedMode && (savedMode === 'light' || savedMode === 'dark')) {
      setModeState(savedMode);
      if (savedMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      document.documentElement.classList.add('dark');
    }
    setMounted(true);
  }, []);

  const setPalette = (name: string) => {
    if (colorPalettes[name]) {
      setPaletteState(colorPalettes[name]);
      localStorage.setItem("theme-palette", name);
    }
  };

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  if (!siteConfig.theme?.cssVars) return null;
  const { cssVars } = siteConfig.theme;

  // Select base theme variables
  const baseTheme = themes[mode];

  // Merge base theme vars with active palette overrides
  const activeVars = {
    ...baseTheme,
    primary: palette.cssVars.primary,
    ring: palette.cssVars.ring,
    secondary: palette.cssVars.secondary,
    accent: palette.cssVars.accent,
  };

  return (
    <ThemeColorContext.Provider value={{ palette, setPalette, mode, setMode }}>
      <style jsx global>{`
        :root {
          --background: ${activeVars.background};
          --foreground: ${activeVars.foreground};
          --card: ${activeVars.card};
          --card-foreground: ${activeVars.cardForeground};
          --popover: ${activeVars.popover};
          --popover-foreground: ${activeVars.popoverForeground};
          --primary: ${activeVars.primary};
          --primary-foreground: ${palette.cssVars.primary.startsWith('#') || palette.cssVars.primary.startsWith('hsl') ? 'hsl(0 0% 100%)' : 'white'};
          --secondary: ${activeVars.secondary};
          --secondary-foreground: ${activeVars.secondaryForeground};
          --muted: ${activeVars.muted};
          --muted-foreground: ${activeVars.mutedForeground};
          --accent: ${activeVars.accent};
          --accent-foreground: ${activeVars.accentForeground};
          --destructive: ${activeVars.destructive};
          --destructive-foreground: ${activeVars.destructiveForeground};
          --border: ${activeVars.border};
          --input: ${activeVars.input};
          --ring: ${activeVars.ring};
          --radius: ${siteConfig.theme.cssVars.radius};
        }

        ::selection {
            background-color: ${activeVars.primary};
            color: ${palette.cssVars.primary.startsWith('#') || palette.cssVars.primary.startsWith('hsl') ? 'hsl(0 0% 100%)' : 'white'};
        }
      `}</style>
      {children}
    </ThemeColorContext.Provider>
  );
}
