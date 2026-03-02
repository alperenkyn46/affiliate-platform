"use client";

import { Button } from "@/components/ui";
import { Container } from "@/components/layout";

export default function HeroSection() {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gold/3 rounded-full blur-3xl" />
      </div>

      <Container className="relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <span className="text-gold text-sm font-medium">2024&apos;ün En İyi Bonusları</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-6">
            <span className="text-white">En Yüksek </span>
            <span className="text-gradient neon-glow">Casino Bonusları</span>
            <span className="text-white"> Burada</span>
          </h1>

          {/* Subtitle */}
          <p className="text-gray-400 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Türkiye&apos;nin en güvenilir casino sitelerini karşılaştırın. 
            Özel hoşgeldin bonusları ve freespin fırsatlarını kaçırmayın!
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" glow>
              Bonusları Keşfet
            </Button>
            <a href="#how-it-works">
              <Button size="lg" variant="outline">
                Nasıl Çalışır?
              </Button>
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-12 max-w-2xl mx-auto">
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5">
              <div className="text-2xl md:text-3xl font-bold text-gold">50+</div>
              <div className="text-gray-400 text-sm">Casino Sitesi</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5">
              <div className="text-2xl md:text-3xl font-bold text-gold">10K+</div>
              <div className="text-gray-400 text-sm">Mutlu Üye</div>
            </div>
            <div className="p-4 rounded-xl bg-secondary/50 border border-white/5">
              <div className="text-2xl md:text-3xl font-bold text-gold">₺5M+</div>
              <div className="text-gray-400 text-sm">Bonus Dağıtıldı</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
