import { Container } from "@/components/layout";

const steps = [
  {
    number: "1",
    title: "Casino Seçin",
    description: "Listemizden size en uygun casino sitesini seçin. Bonus detaylarını ve kullanıcı puanlarını karşılaştırın.",
    icon: "🎯",
  },
  {
    number: "2",
    title: "Kayıt Olun",
    description: "Seçtiğiniz casino sitesine özel bağlantımız üzerinden kayıt olun ve hoşgeldin bonusunuzu otomatik olarak alın.",
    icon: "📝",
  },
  {
    number: "3",
    title: "Bonus Alın",
    description: "Hoşgeldin bonusunuz hesabınıza tanımlanacaktır. Bonus kurallarını okumayı unutmayın.",
    icon: "🎁",
  },
  {
    number: "4",
    title: "Kazanmaya Başlayın",
    description: "Favori oyunlarınızı oynayın ve kazançlarınızı çekin. Sorumlu oyun ilkelerine uygun şekilde eğlenin.",
    icon: "🏆",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-16 md:py-20">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nasıl Çalışır?</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            4 basit adımda en iyi casino bonuslarından yararlanmaya başlayın
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div key={step.number} className="relative bg-secondary rounded-xl p-6 border border-white/5 text-center group hover:border-gold/30 transition-all">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gold text-background font-bold text-sm flex items-center justify-center">
                {step.number}
              </div>
              <div className="text-4xl mb-4 mt-2">{step.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
