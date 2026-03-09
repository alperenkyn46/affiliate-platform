"use client";

import { ReactNode, useEffect } from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AffiliateProvider } from "@/contexts/AffiliateContext";
import ThemeProvider from "./ThemeProvider";
import VisitorTracker from "./VisitorTracker";

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  return (
    <AffiliateProvider>
      <LanguageProvider>
        <SettingsProvider>
          <AuthProvider>
            <ThemeProvider>
              <VisitorTracker />
              {children}
            </ThemeProvider>
          </AuthProvider>
        </SettingsProvider>
      </LanguageProvider>
    </AffiliateProvider>
  );
}
