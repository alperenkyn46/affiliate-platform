"use client";

import { Ad } from "@/types";
import AdCard from "./AdCard";

interface AdCardGridProps {
  ads: Ad[];
  variant?: "default" | "compact";
  columns?: 2 | 3 | 4;
}

export default function AdCardGrid({
  ads,
  variant = "default",
  columns = 4,
}: AdCardGridProps) {
  if (variant === "compact") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {ads.map((ad) => (
          <AdCard key={ad.id} ad={ad} variant="compact" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 ${
        columns === 2
          ? "lg:grid-cols-2"
          : columns === 3
          ? "lg:grid-cols-3"
          : "lg:grid-cols-4"
      }`}
    >
      {ads.map((ad, index) => (
        <div
          key={ad.id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <AdCard ad={ad} />
        </div>
      ))}
    </div>
  );
}
