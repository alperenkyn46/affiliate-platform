"use client";

import React, { useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function adjustColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;

  const adjust = (value: number) => {
    const adjusted = Math.round(value + (255 - value) * (percent / 100));
    return Math.min(255, Math.max(0, adjusted));
  };

  if (percent > 0) {
    // Lighten
    return `#${adjust(rgb.r).toString(16).padStart(2, "0")}${adjust(rgb.g).toString(16).padStart(2, "0")}${adjust(rgb.b).toString(16).padStart(2, "0")}`;
  } else {
    // Darken
    const darken = (value: number) => Math.round(value * (1 + percent / 100));
    return `#${darken(rgb.r).toString(16).padStart(2, "0")}${darken(rgb.g).toString(16).padStart(2, "0")}${darken(rgb.b).toString(16).padStart(2, "0")}`;
  }
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings, isLoading } = useSettings();
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const root = document.documentElement;

    // Primary color (gold)
    const primaryColor = settings.primaryColor || "#d4af37";
    const primaryRgb = hexToRgb(primaryColor);

    root.style.setProperty("--color-gold", primaryColor);
    root.style.setProperty("--color-gold-light", adjustColor(primaryColor, 30));
    root.style.setProperty("--color-gold-dark", adjustColor(primaryColor, -20));
    
    if (primaryRgb) {
      root.style.setProperty("--color-gold-rgb", `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
    }

    // Secondary color (background tones)
    const secondaryColor = settings.secondaryColor || "#1a1a1a";
    const secondaryRgb = hexToRgb(secondaryColor);

    root.style.setProperty("--color-secondary", secondaryColor);
    root.style.setProperty("--color-secondary-light", adjustColor(secondaryColor, 15));
    
    // Background is darker than secondary
    root.style.setProperty("--color-background", adjustColor(secondaryColor, -30));

    if (secondaryRgb) {
      root.style.setProperty("--color-secondary-rgb", `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    }

    // Mark as ready after first render with settings
    if (!isLoading) {
      setIsReady(true);
    }
  }, [settings, isLoading]);

  // Show loading screen until settings are loaded
  if (!isReady) {
    return (
      <div 
        style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: settings.secondaryColor || '#0f0f0f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}
      >
        <div 
          style={{
            width: 40,
            height: 40,
            border: `3px solid ${settings.primaryColor || '#d4af37'}`,
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return <>{children}</>;
}
