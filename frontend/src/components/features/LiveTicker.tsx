"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

interface ClickItem {
  id: number;
  ad_title: string;
  country: string;
  created_at: string;
}

interface DisplayItem {
  id: number;
  name: string;
  site: string;
  time: string;
}

const countryNames: Record<string, string> = {
  TR: "Türkiye", DE: "Almanya", NL: "Hollanda", GB: "İngiltere", US: "ABD",
  FR: "Fransa", IT: "İtalya", ES: "İspanya", AT: "Avusturya", SE: "İsveç",
};

const fakeNames = ["Ahmet", "Mehmet", "Ali", "Veli", "Can", "Cem", "Deniz", "Emre", "Fatih", "Gökhan"];

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  return `${Math.floor(hours / 24)} gün önce`;
}

export default function LiveTicker() {
  const [items, setItems] = useState<DisplayItem[]>([]);

  const loadClicks = async () => {
    try {
      const response = await api.getRecentClicks();
      if (response.success && response.data) {
        const clicks = response.data as ClickItem[];
        if (clicks.length > 0) {
          setItems(
            clicks.map((c) => ({
              id: c.id,
              name: fakeNames[c.id % fakeNames.length],
              site: c.ad_title,
              time: formatTimeAgo(c.created_at),
            }))
          );
          return;
        }
      }
    } catch {
      // fallback below
    }
    setItems(
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        name: fakeNames[i % fakeNames.length],
        site: ["BetKing", "RoyalBet", "SpinPalace", "GoldBet"][i % 4],
        time: `${(i + 1) * 3} dk önce`,
      }))
    );
  };

  useEffect(() => {
    loadClicks();
    const interval = setInterval(loadClicks, 30000);
    return () => clearInterval(interval);
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="w-full bg-secondary/80 backdrop-blur-sm border-y border-white/5 py-3 overflow-hidden">
      <div className="flex animate-ticker">
        {[...items, ...items].map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex items-center gap-2 px-6 whitespace-nowrap">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">{item.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gold font-bold">{item.site}</span>
            <span className="text-gray-400">ziyaret etti</span>
            <span className="text-gray-500 text-sm">({item.time})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
