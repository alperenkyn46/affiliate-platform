"use client";

import { useEffect, useState } from "react";

interface WinnerItem {
  id: number;
  name: string;
  amount: string;
  game: string;
}

const generateRandomWinner = (): WinnerItem => {
  const names = ["Ahmet", "Mehmet", "Ali", "Veli", "Can", "Cem", "Deniz", "Emre", "Fatih", "Gökhan"];
  const games = ["Sweet Bonanza", "Gates of Olympus", "Big Bass", "Book of Dead", "Razor Shark"];
  const amounts = ["2.500₺", "5.000₺", "12.000₺", "750₺", "3.200₺", "8.500₺", "15.000₺", "1.800₺"];

  return {
    id: Date.now() + Math.random(),
    name: names[Math.floor(Math.random() * names.length)],
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    game: games[Math.floor(Math.random() * games.length)],
  };
};

export default function LiveTicker() {
  const [winners, setWinners] = useState<WinnerItem[]>([]);

  useEffect(() => {
    const initialWinners = Array.from({ length: 10 }, generateRandomWinner);
    setWinners(initialWinners);

    const interval = setInterval(() => {
      setWinners((prev) => {
        const newWinner = generateRandomWinner();
        return [newWinner, ...prev.slice(0, 9)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-secondary/80 backdrop-blur-sm border-y border-white/5 py-3 overflow-hidden">
      <div className="flex animate-ticker">
        {/* Duplicate for seamless loop */}
        {[...winners, ...winners].map((winner, index) => (
          <div
            key={`${winner.id}-${index}`}
            className="flex items-center gap-2 px-6 whitespace-nowrap"
          >
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white font-medium">{winner.name}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gold font-bold">{winner.amount}</span>
            <span className="text-gray-400">kazandı!</span>
            <span className="text-gray-500 text-sm">({winner.game})</span>
          </div>
        ))}
      </div>
    </div>
  );
}
