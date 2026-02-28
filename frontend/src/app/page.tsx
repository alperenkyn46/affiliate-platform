"use client";

import { useState, useEffect } from "react";
import { Header, Footer } from "@/components/layout";
import {
  HeroSection,
  FeaturedSection,
  CasinoListSection,
  PromotionBanner,
  TrustSection,
} from "@/components/sections";
import { LiveTicker, BonusWheel, ExitPopup } from "@/components/features";
import { api } from "@/lib/api";
import { Ad } from "@/types";
import { featuredAds as mockFeaturedAds, regularAds as mockRegularAds } from "@/data/mockAds";

export default function Home() {
  const [showWheel, setShowWheel] = useState(false);
  const [featuredAds, setFeaturedAds] = useState<Ad[]>(mockFeaturedAds);
  const [regularAds, setRegularAds] = useState<Ad[]>(mockRegularAds);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAds();
  }, []);

  const loadAds = async () => {
    try {
      const response = await api.getAds();
      if (response.success && response.data) {
        const ads = response.data as Ad[];
        // Veritabanından gelen veriyi featured ve regular olarak ayır
        // MySQL featured alanı 0/1 olarak döner
        const featured = ads.filter((ad: Ad) => ad.featured === true || ad.featured === 1);
        const regular = ads.filter((ad: Ad) => ad.featured !== true && ad.featured !== 1);
        setFeaturedAds(featured.length > 0 ? featured : mockFeaturedAds);
        setRegularAds(regular.length > 0 ? regular : mockRegularAds);
      }
    } catch (error) {
      console.error("Failed to load ads:", error);
      // Hata durumunda mock data kullan
    } finally {
      setIsLoading(false);
    }
  };

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
