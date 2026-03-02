"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "tr" ? "en" : "tr")}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-gold hover:bg-white/5 transition-all"
      title={locale === "tr" ? "Switch to English" : "Türkçe'ye geç"}
    >
      <span className="text-base">{locale === "tr" ? "🇬🇧" : "🇹🇷"}</span>
      <span className="hidden sm:inline">{locale === "tr" ? "EN" : "TR"}</span>
    </button>
  );
}
