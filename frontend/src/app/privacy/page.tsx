import type { Metadata } from "next";
import { Header, Footer } from "@/components/layout";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: "CasinoHub gizlilik politikası. Kişisel verilerinizin nasıl toplandığı ve kullanıldığı hakkında bilgi edinin.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">Gizlilik Politikası</h1>
          
          <div className="prose prose-invert max-w-none space-y-6">
            <p className="text-gray-400 leading-relaxed">
              Son güncelleme: {new Date().toLocaleDateString("tr-TR")}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">1. Toplanan Bilgiler</h2>
              <p className="text-gray-300 leading-relaxed">
                Sitemizi ziyaret ettiğinizde, hizmetlerimizi iyileştirmek amacıyla bazı bilgiler otomatik olarak toplanabilir. 
                Bunlar arasında IP adresi, tarayıcı türü, cihaz bilgisi, ziyaret edilen sayfalar ve coğrafi konum bilgileri yer alır.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">2. Bilgilerin Kullanımı</h2>
              <p className="text-gray-300 leading-relaxed">
                Toplanan bilgiler; site deneyimini kişiselleştirmek, analitik ve istatistiksel amaçlarla, 
                hizmet kalitesini artırmak ve yasal yükümlülükleri yerine getirmek için kullanılmaktadır.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">3. Çerezler (Cookies)</h2>
              <p className="text-gray-300 leading-relaxed">
                Sitemiz, kullanıcı deneyimini geliştirmek için çerezler kullanmaktadır. 
                Çerezler, tercihlerinizi hatırlamak ve site kullanımınızı analiz etmek amacıyla kullanılır. 
                Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">4. Üçüncü Taraf Bağlantılar</h2>
              <p className="text-gray-300 leading-relaxed">
                Sitemiz, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu sitelerin gizlilik politikaları 
                üzerinde kontrolümüz bulunmamaktadır. Bu bağlantıları takip ettiğinizde, ilgili sitenin 
                gizlilik politikasını incelemenizi öneririz.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">5. Veri Güvenliği</h2>
              <p className="text-gray-300 leading-relaxed">
                Kişisel verilerinizin güvenliğini sağlamak için uygun teknik ve organizasyonel önlemler alınmaktadır. 
                Ancak, internet üzerinden yapılan hiçbir veri iletiminin %100 güvenli olmadığını hatırlatmak isteriz.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-white">6. İletişim</h2>
              <p className="text-gray-300 leading-relaxed">
                Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
