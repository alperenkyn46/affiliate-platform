import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Kullanım Şartları",
  description: "CasinoHub kullanım şartları ve koşulları.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Kullanım Şartları</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-gray-400 leading-relaxed">
              Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">1. Genel Koşullar</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu web sitesini kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. 
                Sitemiz yalnızca 18 yaş ve üzeri bireyler tarafından kullanılabilir.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">2. Hizmet Tanımı</h2>
              <p className="text-gray-300 leading-relaxed">
                CasinoHub, çeşitli casino sitelerinin bonuslarını ve promosyonlarını karşılaştıran bir bilgi platformudur. 
                Doğrudan kumar hizmeti sunmamaktayız. Listelenen siteler bağımsız operatörler tarafından işletilmektedir.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">3. Sorumluluk Reddi</h2>
              <p className="text-gray-300 leading-relaxed">
                Sitemizde yer alan bilgiler yalnızca bilgilendirme amaçlıdır. Casino sitelerinde yapacağınız 
                işlemlerden doğacak kayıplardan sorumlu değiliz. Kumar bağımlılık yapabilir, lütfen sorumlu oynayın.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">4. Fikri Mülkiyet</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu sitedeki tüm içerik, tasarım, logo ve markalar CasinoHub&apos;a aittir. 
                İzinsiz kopyalanması veya dağıtılması yasaktır.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">5. Bağlantı Politikası</h2>
              <p className="text-gray-300 leading-relaxed">
                Sitemiz üzerinden erişilen üçüncü taraf web sitelerinin içeriklerinden ve hizmetlerinden 
                sorumlu değiliz. Bu sitelere yönlendirildiğinizde kendi kullanım şartlarına tabi olursunuz.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">6. Değişiklikler</h2>
              <p className="text-gray-300 leading-relaxed">
                Bu kullanım şartlarını önceden bildirmeksizin değiştirme hakkını saklı tutarız. 
                Güncel şartları bu sayfadan takip edebilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
