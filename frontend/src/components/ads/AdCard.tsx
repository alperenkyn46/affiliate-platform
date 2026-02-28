"use client";

import Image from "next/image";
import { Ad } from "@/types";
import { Button, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

interface AdCardProps {
  ad: Ad;
  variant?: "default" | "featured" | "compact";
}

export default function AdCard({ ad, variant = "default" }: AdCardProps) {
  // Normalize data from database
  const bonusDetails = ad.bonusDetails || ad.bonus_details;
  const isFeatured = ad.featured === true || ad.featured === 1;
  const tags: string[] = Array.isArray(ad.tags) 
    ? ad.tags 
    : typeof ad.tags === 'string' 
      ? JSON.parse(ad.tags || '[]') 
      : [];

  const handleClick = () => {
    window.open(`/go/${ad.id}`, "_blank");
  };

  if (variant === "compact") {
    return (
      <div
        className="flex items-center gap-4 p-4 bg-secondary rounded-xl border border-white/5 hover:border-gold/30 transition-all cursor-pointer group"
        onClick={handleClick}
      >
        {/* Logo */}
        <div className="w-16 h-16 rounded-lg bg-secondary-light flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center">
            <span className="text-gold font-bold text-lg">{ad.title[0]}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white truncate">{ad.title}</h4>
          <p className="text-gold text-sm font-medium">{ad.bonus}</p>
        </div>

        {/* Button */}
        <Button size="sm" className="flex-shrink-0 group-hover:shadow-glow">
          Oyna
        </Button>
      </div>
    );
  }

  if (variant === "featured") {
    return (
      <div
        className={cn(
          "relative p-6 rounded-2xl overflow-hidden cursor-pointer group",
          "bg-gradient-to-br from-secondary via-secondary to-secondary-light",
          "border border-gold/30 hover:border-gold transition-all duration-300",
          "hover:shadow-glow-lg"
        )}
        onClick={handleClick}
      >
        {/* Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="absolute top-4 right-4 flex gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="gold" size="sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="relative flex flex-col md:flex-row items-center gap-6">
          {/* Logo */}
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-secondary-light flex items-center justify-center overflow-hidden flex-shrink-0 border border-white/10">
            <div className="w-20 h-20 md:w-28 md:h-28 rounded-xl bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center">
              <span className="text-gold font-bold text-4xl md:text-5xl">{ad.title[0]}</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h3 className="text-2xl font-bold text-white">{ad.title}</h3>
              {ad.rating && (
                <div className="flex items-center gap-1 text-gold">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-semibold">{ad.rating}</span>
                </div>
              )}
            </div>
            <p className="text-gray-400 mb-4">{ad.description}</p>
            <div className="mb-4">
              <span className="text-3xl md:text-4xl font-bold text-gradient">{ad.bonus}</span>
              {bonusDetails && (
                <span className="block text-gray-400 text-sm mt-1">{bonusDetails}</span>
              )}
            </div>
            <Button size="lg" glow className="w-full md:w-auto">
              Hemen Oyna
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={cn(
        "relative p-5 rounded-xl overflow-hidden cursor-pointer group",
        "bg-secondary border border-white/5 hover:border-gold/30",
        "transition-all duration-300 hover:scale-[1.02]"
      )}
      onClick={handleClick}
    >
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="absolute top-3 right-3 flex gap-1">
          {tags.slice(0, 1).map((tag) => (
            <Badge key={tag} variant="gold" size="sm">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Logo */}
      <div className="w-16 h-16 rounded-xl bg-secondary-light flex items-center justify-center overflow-hidden mb-4 border border-white/10">
        <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-gold/20 to-gold-light/20 flex items-center justify-center">
          <span className="text-gold font-bold text-2xl">{ad.title[0]}</span>
        </div>
      </div>

      {/* Content */}
      <h4 className="font-bold text-white text-lg mb-1">{ad.title}</h4>
      <p className="text-gray-400 text-sm mb-3 line-clamp-1">{ad.description}</p>

      {/* Bonus */}
      <div className="mb-4">
        <span className="text-xl font-bold text-gold">{ad.bonus}</span>
        {bonusDetails && (
          <span className="block text-gray-500 text-xs">{bonusDetails}</span>
        )}
      </div>

      {/* Rating */}
      {ad.rating && (
        <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
          <svg className="w-4 h-4 fill-gold" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span>{ad.rating}</span>
        </div>
      )}

      {/* Button */}
      <Button className="w-full group-hover:shadow-glow">Oyna</Button>
    </div>
  );
}
