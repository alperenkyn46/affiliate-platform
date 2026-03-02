"use client";

import Link from "next/link";
import Container from "./Container";
import { useSettings } from "@/contexts/SettingsContext";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { settings } = useSettings();
  const { t } = useLanguage();

  const footerLinks = [
    { name: t("nav.privacy"), href: "/privacy" },
    { name: t("nav.terms"), href: "/terms" },
    { name: t("nav.about"), href: "/about" },
    { name: t("nav.contact"), href: "/contact" },
  ];

  const socialLinks = [
    { name: "Discord", href: settings.socialDiscord },
    { name: "Telegram", href: settings.socialTelegram },
    { name: "Twitch", href: settings.socialTwitch },
    { name: "Kick", href: settings.socialKick },
    { name: "YouTube", href: settings.socialYoutube },
  ];

  // Site adından ilk harfi al
  const siteInitial = settings.siteName.charAt(0).toUpperCase();
  const siteParts = settings.siteName.split(/(?=[A-Z])/);

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
                  <span className="text-background font-bold text-xl">{siteInitial}</span>
                </div>
                <span className="text-xl font-bold">
                  {siteParts.length >= 2 ? (
                    <>
                      <span className="text-white">{siteParts[0]}</span>
                      <span className="text-gradient">{siteParts.slice(1).join("")}</span>
                    </>
                  ) : (
                    <span className="text-gradient">{settings.siteName}</span>
                  )}
                </span>
              </Link>
              <p className="text-gray-400 text-sm leading-relaxed">
                En iyi casino bonuslarını ve promosyonlarını sizin için bir araya getiriyoruz. 
                Güvenilir ve lisanslı sitelerle kazanmaya başlayın.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">{t("footer.quickLinks")}</h4>
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
              <h4 className="text-white font-semibold mb-4">{t("footer.followUs")}</h4>
              <div className="flex flex-wrap gap-2">
                {socialLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target={link.href !== "#" ? "_blank" : undefined}
                    rel={link.href !== "#" ? "noopener noreferrer" : undefined}
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
              {t("footer.disclaimer")}
            </p>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} {settings.siteName}. {t("footer.rights")}
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-600 text-xs">18+</span>
              <span className="text-gray-600 text-xs">|</span>
              <span className="text-gray-600 text-xs">{t("footer.responsibleGaming")}</span>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
