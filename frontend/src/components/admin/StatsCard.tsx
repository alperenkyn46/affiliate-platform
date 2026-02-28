"use client";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ReactNode;
  color?: "gold" | "green" | "blue" | "purple";
}

export default function StatsCard({
  title,
  value,
  change,
  icon,
  color = "gold",
}: StatsCardProps) {
  const colorClasses = {
    gold: "bg-gold/10 text-gold",
    green: "bg-green-500/10 text-green-500",
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="bg-secondary rounded-xl p-6 border border-white/5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value.toLocaleString()}</p>
          {change !== undefined && (
            <p
              className={cn(
                "text-sm mt-2",
                change >= 0 ? "text-green-500" : "text-red-500"
              )}
            >
              {change >= 0 ? "↑" : "↓"} {Math.abs(change)}% bu hafta
            </p>
          )}
        </div>
        <div className={cn("p-3 rounded-lg", colorClasses[color])}>{icon}</div>
      </div>
    </div>
  );
}
