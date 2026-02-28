"use client";

import { Ad } from "@/types";
import { Container } from "@/components/layout";
import { AdCardGrid } from "@/components/ads";

interface CasinoListSectionProps {
  ads: Ad[];
}

export default function CasinoListSection({ ads }: CasinoListSectionProps) {
  return (
    <section className="py-12 md:py-16">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            🎰 Tüm Casino Siteleri
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Güvenilir ve lisanslı casino sitelerini inceleyin, size en uygun bonusu bulun
          </p>
        </div>

        {/* Casino Grid */}
        <AdCardGrid ads={ads} columns={4} />
      </Container>
    </section>
  );
}
