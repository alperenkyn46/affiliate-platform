"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { useSettings } from "@/contexts/SettingsContext";

const prizeLabels = [
  "50 Freespin",
  "100₺ Bonus",
  "Tekrar Dene",
  "200₺ Bonus",
  "25 Freespin",
  "%50 Bonus",
  "150 Freespin",
  "500₺ Bonus",
];

interface BonusWheelProps {
  onClose?: () => void;
}

export default function BonusWheel({ onClose }: BonusWheelProps) {
  const { settings } = useSettings();
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  // Admin ayarlarından renkleri al
  const primaryColor = settings.primaryColor || "#d4af37";
  const secondaryColor = settings.secondaryColor || "#1a1a1a";

  // Debug - konsola yazdır
  console.log("BonusWheel Settings:", { 
    primaryColor, 
    secondaryColor, 
    fullSettings: settings 
  });

  // Çift/tek sırayla renkleri dağıt
  const prizes = prizeLabels.map((label, index) => ({
    label,
    color: index % 2 === 0 ? primaryColor : secondaryColor,
  }));

  const spinWheel = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    setResult(null);

    const prizeIndex = Math.floor(Math.random() * prizes.length);
    const segmentAngle = 360 / prizes.length;
    const targetAngle = 360 * 5 + (360 - prizeIndex * segmentAngle - segmentAngle / 2);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(prizes[prizeIndex].label);
      setHasSpun(true);

      // Set cookie to prevent spinning again
      document.cookie = "wheel_spun=true; max-age=86400"; // 24 hours
    }, 4000);
  };

  // Renk kontrastını hesapla (açık mı koyu mu)
  const isLightColor = (hex: string) => {
    const c = hex.substring(1);
    const rgb = parseInt(c, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.299 * r + 0.587 * g + 0.114 * b;
    return luma > 128;
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-secondary rounded-2xl p-6 md:p-8 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold text-white text-center mb-2">Bonus Çarkı</h2>
        <p className="text-gray-400 text-center mb-6">Şansını dene, bonus kazan!</p>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 mx-auto mb-6">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div 
              className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent"
              style={{ borderTopColor: primaryColor }}
            />
          </div>

          {/* Wheel */}
          <div
            className="w-full h-full rounded-full overflow-hidden transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
              border: `4px solid ${primaryColor}`,
            }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index;
                const startAngle = (angle * Math.PI) / 180;
                const endAngle = ((angle + 360 / prizes.length) * Math.PI) / 180;

                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const largeArcFlag = 360 / prizes.length > 180 ? 1 : 0;

                // Yazı rengi: arka plan açıksa koyu, koyuysa açık
                const textColor = isLightColor(prize.color) ? "#0f0f0f" : "#ffffff";

                return (
                  <g key={index}>
                    <path
                      d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                      fill={prize.color}
                      stroke="#0f0f0f"
                      strokeWidth="0.5"
                    />
                    <text
                      x="50"
                      y="50"
                      fill={textColor}
                      fontSize="4"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${angle + 360 / prizes.length / 2}, 50, 50) translate(25, 0) rotate(90)`}
                    >
                      {prize.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center"
            style={{ 
              backgroundColor: primaryColor,
              boxShadow: `0 0 20px ${primaryColor}`,
            }}
          >
            <span className="text-xl" style={{ color: isLightColor(primaryColor) ? "#0f0f0f" : "#ffffff" }}>🎰</span>
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="text-center mb-4 animate-fade-in">
            <p className="text-gray-400 mb-2">Tebrikler! Kazandınız:</p>
            <p className="text-3xl font-bold text-gradient">{result}</p>
          </div>
        )}

        {/* Spin Button */}
        <Button
          onClick={spinWheel}
          disabled={isSpinning || hasSpun}
          className="w-full"
          glow={!hasSpun}
        >
          {isSpinning ? "Döndürülüyor..." : hasSpun ? "Tekrar yarın deneyin!" : "Çevir!"}
        </Button>
      </div>
    </div>
  );
}
