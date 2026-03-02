"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface BonusAd {
  id: number;
  title: string;
  bonus: string;
  bonus_details?: string;
  bonusDetails?: string;
}

interface BonusNotificationProps {
  ads: BonusAd[];
  delay?: number; // İlk bildirim için bekleme süresi (ms)
  interval?: number; // Bildirimler arası süre (ms)
  duration?: number; // Her bildirimin ekranda kalma süresi (ms)
}

export default function BonusNotification({
  ads,
  delay = 5000,
  interval = 8000,
  duration = 6000,
}: BonusNotificationProps) {
  const [currentNotification, setCurrentNotification] = useState<BonusAd | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Session'da kapatıldıysa gösterme
    if (sessionStorage.getItem("bonus_notifications_dismissed") === "true") {
      setDismissed(true);
      return;
    }

    if (dismissed || ads.length === 0) return;

    // İlk bildirim için bekle
    const initialTimeout = setTimeout(() => {
      showNotification(0);
    }, delay);

    return () => clearTimeout(initialTimeout);
  }, [ads, delay, dismissed]);

  useEffect(() => {
    if (dismissed || !currentNotification) return;

    // Bildirimi belirli süre sonra kapat
    const hideTimeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Bir sonraki bildirimi göster
    const nextTimeout = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % ads.length;
      if (nextIndex !== 0) {
        // Tüm reklamları gösterdiyse dur (veya döngü istersen !== 0 kontrolünü kaldır)
        showNotification(nextIndex);
      }
    }, interval);

    return () => {
      clearTimeout(hideTimeout);
      clearTimeout(nextTimeout);
    };
  }, [currentNotification, currentIndex, interval, duration, dismissed, ads]);

  const showNotification = (index: number) => {
    if (index >= ads.length) return;
    setCurrentNotification(ads[index]);
    setCurrentIndex(index);
    setIsVisible(true);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setDismissed(true);
    sessionStorage.setItem("bonus_notifications_dismissed", "true");
  };

  const handleClick = () => {
    if (currentNotification) {
      window.open(`/go/${currentNotification.id}`, "_blank");
    }
  };

  if (!currentNotification || dismissed) return null;

  const bonusDetails = currentNotification.bonus_details || currentNotification.bonusDetails;

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 transition-all duration-500 ${
        isVisible
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
      }`}
    >
      <div className="bg-secondary border border-gold/30 rounded-xl shadow-glow overflow-hidden max-w-sm">
        {/* Header */}
        <div className="bg-gold/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎁</span>
            <span className="text-gold text-sm font-semibold">Özel Fırsat!</span>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors p-1"
            title="Bildirimleri Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div
          onClick={handleClick}
          className="p-4 cursor-pointer hover:bg-white/5 transition-colors"
        >
          <h4 className="text-white font-bold text-lg mb-1">
            {currentNotification.title}
          </h4>
          <p className="text-2xl font-bold text-gradient mb-1">
            {currentNotification.bonus}
          </p>
          {bonusDetails && (
            <p className="text-gray-400 text-sm">{bonusDetails}</p>
          )}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-gold text-sm font-medium">Hemen Al →</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs">Aktif</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-background">
          <div
            className="h-full bg-gold transition-all ease-linear"
            style={{
              width: isVisible ? "0%" : "100%",
              transitionDuration: `${duration}ms`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
