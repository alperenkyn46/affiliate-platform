"use client";

import { useEffect } from "react";
import { api } from "@/lib/api";

export default function VisitorTracker() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        await api.recordVisitor(window.location.pathname);
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    trackVisitor();
  }, []);

  return null;
}
