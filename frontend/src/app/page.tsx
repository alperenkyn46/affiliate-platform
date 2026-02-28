"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  FeaturedSection,
  CasinoListSection,
  PromotionBanner,
  TrustSection,
} from "@/components/sections";
import { LiveTicker, BonusWheel, ExitPopup } from "@/components/features";
import { featuredAds, regularAds } from "@/data/mockAds";

export default function Home() {
  const [showWheel, setShowWheel] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Live Winner Ticker */}
      <LiveTicker />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Trust Badges */}
        <TrustSection />

        {/* Featured Casinos */}
        <FeaturedSection ads={featuredAds.slice(0, 3)} />

        {/* Bonus Wheel CTA */}
        <div className="text-center py-8">
          <button
            onClick={() => setShowWheel(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold to-gold-light text-background font-semibold rounded-full animate-pulse-glow shadow-glow hover:shadow-glow-lg transition-all"
          >
            <span className="text-2xl">🎰</span>
            <span>Bonus Çarkını Çevir!</span>
          </button>
        </div>

        {/* Promotion Banner */}
        <PromotionBanner />

        {/* All Casinos */}
        <CasinoListSection ads={regularAds} />
      </main>

      <Footer />

      {/* Bonus Wheel Modal */}
      {showWheel && <BonusWheel onClose={() => setShowWheel(false)} />}

      {/* Exit Intent Popup */}
      <ExitPopup />
    </div>
  );
}
