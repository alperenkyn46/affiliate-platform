"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/lib/api";

interface SiteSettings {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  socialDiscord: string;
  socialTelegram: string;
  socialTwitch: string;
  socialKick: string;
  socialYoutube: string;
  promotionAdId: string;
  promotionTitle: string;
  promotionDescription: string;
  exitPopupAdId: string;
  exitPopupTitle: string;
  exitPopupDescription: string;
}

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SETTINGS_CACHE_KEY = "site_settings_cache";

const defaultSettings: SiteSettings = {
  siteName: "CasinoHub",
  primaryColor: "#d4af37",
  secondaryColor: "#1a1a1a",
  socialDiscord: "#",
  socialTelegram: "#",
  socialTwitch: "#",
  socialKick: "#",
  socialYoutube: "#",
  promotionAdId: "",
  promotionTitle: "",
  promotionDescription: "",
  exitPopupAdId: "",
  exitPopupTitle: "",
  exitPopupDescription: "",
};

function getCachedSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const cached = localStorage.getItem(SETTINGS_CACHE_KEY);
    if (cached) {
      return JSON.parse(cached) as SiteSettings;
    }
  } catch {
    // Ignore parse errors
  }
  return defaultSettings;
}

function setCachedSettings(settings: SiteSettings) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SETTINGS_CACHE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(getCachedSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await api.getPublicSettings();
      if (response.success && response.data) {
        const newSettings = response.data as SiteSettings;
        setSettings(newSettings);
        setCachedSettings(newSettings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
