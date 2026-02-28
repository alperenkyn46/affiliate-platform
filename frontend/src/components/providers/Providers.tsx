"use client";

import { ReactNode } from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AuthProvider } from "@/contexts/AuthContext";
import ThemeProvider from "./ThemeProvider";
import VisitorTracker from "./VisitorTracker";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <AuthProvider>
        <ThemeProvider>
          <VisitorTracker />
          {children}
        </ThemeProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
