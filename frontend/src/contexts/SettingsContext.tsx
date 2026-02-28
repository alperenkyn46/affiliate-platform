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
}

interface SettingsContextType {
  settings: SiteSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
  siteName: "CasinoHub",
  primaryColor: "#d4af37",
  secondaryColor: "#1a1a1a",
  socialDiscord: "#",
  socialTelegram: "#",
  socialTwitch: "#",
  socialKick: "#",
  socialYoutube: "#",
};

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  isLoading: true,
  refreshSettings: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  const loadSettings = async () => {
    try {
      const response = await api.getPublicSettings();
      if (response.success && response.data) {
        setSettings(response.data as SiteSettings);
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
