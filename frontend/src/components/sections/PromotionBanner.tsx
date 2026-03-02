"use client";

import { Button } from "@/components/ui";
import { Container } from "@/components/layout";
import { useSettings } from "@/contexts/SettingsContext";

export default function PromotionBanner() {
  const { settings } = useSettings();
  
  const title = settings.promotionTitle || "Özel Kayıt Bonusu";
  const description = settings.promotionDescription || "İlk üyeliğinize özel %300 hoşgeldin bonusu!";
  const adId = settings.promotionAdId;
  const href = adId ? `/go/${adId}` : "#";

  return (
    <section className="py-12 md:py-16">
      <Container>
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent" />
          <div className="absolute inset-0 bg-secondary" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold text-sm font-medium mb-4">
                ⏰ Sınırlı Süre
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 md:text-lg">{description}</p>
            </div>
            <div className="flex flex-col items-center gap-4">
              <a href={href} target={adId ? "_blank" : undefined} rel={adId ? "noopener noreferrer" : undefined}>
                <Button size="lg" glow>
                  Hemen Kaydol
                </Button>
              </a>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/20 rounded-full blur-3xl" />
        </div>
      </Container>
    </section>
  );
}
