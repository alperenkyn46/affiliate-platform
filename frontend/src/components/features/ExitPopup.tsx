"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { useSettings } from "@/contexts/SettingsContext";

interface ExitPopupProps {
  onClose?: () => void;
}

export default function ExitPopup({ onClose }: ExitPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const { settings } = useSettings();

  const title = settings.exitPopupTitle || "Özel Fırsatı Kaçırma!";
  const description = settings.exitPopupDescription || "Şimdi kayıt ol ve 200 FREE SPIN + %300 Hoşgeldin Bonusu kazan!";
  const adId = settings.exitPopupAdId;
  const href = adId ? `/go/${adId}` : "#";

  useEffect(() => {
    const hasSeenPopup = document.cookie.includes("exit_popup_seen=true");
    if (hasSeenPopup) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setIsVisible(true);
        document.cookie = "exit_popup_seen=true; max-age=86400";
        document.removeEventListener("mouseleave", handleMouseLeave);
      }
    };

    const timeout = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-secondary rounded-2xl p-8 max-w-lg w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-transparent" />
        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="relative text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-5xl">🎁</span>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">BEKLE!</h2>
          <p className="text-xl text-gold font-semibold mb-4">{title}</p>
          <div className="bg-background/50 rounded-xl p-6 mb-6 border border-gold/20">
            <p className="text-gray-300 leading-relaxed">{description}</p>
          </div>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 text-sm">Bu teklif 10 dakika içinde sona erecek!</span>
          </div>
          <div className="space-y-3">
            <a href={href} target={adId ? "_blank" : undefined} rel={adId ? "noopener noreferrer" : undefined}>
              <Button className="w-full" size="lg" glow>
                Bonusu Al
              </Button>
            </a>
            <button onClick={handleClose} className="text-gray-500 hover:text-gray-400 text-sm transition-colors">
              Hayır, bu fırsatı kaçırmak istiyorum
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
