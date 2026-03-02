import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Hakkımızda",
  description: "CasinoHub hakkında bilgi edinin. En güvenilir casino bonusları ve promosyonları karşılaştırma platformu.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Hakkımızda</h1>
          
          <div className="prose prose-invert max-w-none space-y-8">
            <p className="text-lg text-gray-300 leading-relaxed">
              CasinoHub, Türkiye&apos;nin en kapsamlı casino bonus karşılaştırma platformudur. 
              Amacımız, oyunculara en iyi fırsatları sunarak bilinçli kararlar almalarına yardımcı olmaktır.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="bg-secondary rounded-xl p-6 border border-white/5 text-center">
                <div className="text-3xl font-bold text-gold mb-2">50+</div>
                <p className="text-gray-400">Casino Sitesi</p>
              </div>
              <div className="bg-secondary rounded-xl p-6 border border-white/5 text-center">
                <div className="text-3xl font-bold text-gold mb-2">10K+</div>
                <p className="text-gray-400">Mutlu Kullanıcı</p>
              </div>
              <div className="bg-secondary rounded-xl p-6 border border-white/5 text-center">
                <div className="text-3xl font-bold text-gold mb-2">7/24</div>
                <p className="text-gray-400">Güncel İçerik</p>
              </div>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Misyonumuz</h2>
              <p className="text-gray-300 leading-relaxed">
                Oyunculara güvenilir, tarafsız ve güncel bilgiler sunarak en iyi casino deneyimini 
                yaşamalarına yardımcı olmak. Tüm listelediğimiz siteler detaylı inceleme süreçlerinden geçmektedir.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Neden CasinoHub?</h2>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">&#10003;</span>
                  <span>Güvenilir ve lisanslı casino sitelerini listelemekteyiz</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">&#10003;</span>
                  <span>Bonus ve promosyonları düzenli olarak güncelliyoruz</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">&#10003;</span>
                  <span>Tarafsız değerlendirmeler ve kullanıcı yorumları sunuyoruz</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gold mt-1">&#10003;</span>
                  <span>Sorumlu oyun ilkelerini destekliyoruz</span>
                </li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">Sorumlu Oyun</h2>
              <p className="text-gray-300 leading-relaxed">
                Kumar bağımlılık yapabilir. Lütfen bütçeniz dahilinde oynayın ve gerektiğinde 
                profesyonel yardım almaktan çekinmeyin. Sitemiz yalnızca 18 yaş ve üzeri bireyler içindir.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
