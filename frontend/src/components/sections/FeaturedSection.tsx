"use client";

import { Ad } from "@/types";
import { Container } from "@/components/layout";
import { AdCard } from "@/components/ads";

interface FeaturedSectionProps {
  ads: Ad[];
}

export default function FeaturedSection({ ads }: FeaturedSectionProps) {
  if (ads.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              🔥 Öne Çıkan Bonuslar
            </h2>
            <p className="text-gray-400">En yüksek bonus veren siteler</p>
          </div>
        </div>

        {/* Featured Cards */}
        <div className="space-y-6">
          {ads.map((ad, index) => (
            <div
              key={ad.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <AdCard ad={ad} variant="featured" />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
