"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui";

const prizes = [
  { label: "50 Freespin", color: "#d4af37" },
  { label: "100₺ Bonus", color: "#1f1f1f" },
  { label: "Tekrar Dene", color: "#d4af37" },
  { label: "200₺ Bonus", color: "#1f1f1f" },
  { label: "25 Freespin", color: "#d4af37" },
  { label: "%50 Bonus", color: "#1f1f1f" },
  { label: "150 Freespin", color: "#d4af37" },
  { label: "500₺ Bonus", color: "#1f1f1f" },
];

interface BonusWheelProps {
  onClose?: () => void;
}

export default function BonusWheel({ onClose }: BonusWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

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
            <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-gold" />
          </div>

          {/* Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-gold overflow-hidden transition-transform duration-[4000ms] ease-out"
            style={{
              transform: `rotate(${rotation}deg)`,
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
                      fill={prize.color === "#d4af37" ? "#0f0f0f" : "#d4af37"}
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-glow">
            <span className="text-background font-bold text-xl">🎰</span>
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
