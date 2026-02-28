"use client";

import Link from "next/link";
import Container from "./Container";

const socialLinks = [
  { name: "Discord", href: "#" },
  { name: "Telegram", href: "#" },
  { name: "Twitch", href: "#" },
  { name: "Kick", href: "#" },
  { name: "YouTube", href: "#" },
];

const footerLinks = [
  { name: "Gizlilik Politikası", href: "#" },
  { name: "Kullanım Şartları", href: "#" },
  { name: "Sorumlu Oyun", href: "#" },
  { name: "İletişim", href: "#" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary/50 border-t border-white/5 mt-20">
      <Container>
        <div className="py-12">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold to-gold-light flex items-center justify-center">
                  <span className="text-background font-bold text-xl">C</span>
                </div>
                <span className="text-xl font-bold">
                  <span className="text-white">Casino</span>
                  <span className="text-gradient">Hub</span>
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                En iyi casino bonuslarını ve promosyonlarını sizin için bir araya getiriyoruz. 
                Güvenilir ve lisanslı sitelerle kazanmaya başlayın.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Hızlı Linkler</h4>
              <ul className="space-y-2">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-gold transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="text-white font-semibold mb-4">Bizi Takip Edin</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-4 py-2 rounded-lg bg-secondary text-gray-400 hover:text-gold hover:bg-secondary-light transition-all text-sm"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 rounded-lg bg-background/50 border border-white/5 mb-8">
            <p className="text-gray-500 text-xs leading-relaxed">
              <strong className="text-gray-400">Uyarı:</strong> Bu site yalnızca 18 yaş ve üzeri bireyler içindir. 
              Kumar bağımlılık yapabilir. Lütfen sorumlu oynayın. Listelenen siteler bağımsız operatörler tarafından 
              işletilmektedir ve bu platformla doğrudan bağlantıları yoktur. Oyun oynamadan önce yerel yasalarınızı 
              kontrol edin.
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} CasinoHub. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-xs">18+</span>
              <span className="text-gray-600 text-xs">|</span>
              <span className="text-gray-600 text-xs">Sorumlu Oyun</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
