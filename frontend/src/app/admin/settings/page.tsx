"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import { Button } from "@/components/ui";

interface Settings {
  siteName: string;
  primaryColor: string;
  secondaryColor: string;
  socialDiscord: string;
  socialTelegram: string;
  socialTwitch: string;
  socialKick: string;
  socialYoutube: string;
  promotionAdId: string;
  promotionTitle: string;
  promotionDescription: string;
  exitPopupAdId: string;
  exitPopupTitle: string;
  exitPopupDescription: string;
  [key: string]: string;
}

export default function SettingsPage() {
  const { token } = useAuth();
  const [settings, setSettings] = useState<Settings>({
    siteName: "CasinoHub",
    primaryColor: "#d4af37",
    secondaryColor: "#1a1a1a",
    socialDiscord: "#",
    socialTelegram: "#",
    socialTwitch: "#",
    socialKick: "#",
    socialYoutube: "#",
    promotionAdId: "",
    promotionTitle: "",
    promotionDescription: "",
    exitPopupAdId: "",
    exitPopupTitle: "",
    exitPopupDescription: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (token) {
      loadSettings();
    }
  }, [token]);

  const loadSettings = async () => {
    if (!token) return;
    try {
      const response = await api.getSettings(token);
      if (response.success && response.data) {
        setSettings(response.data as Settings);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await api.updateSettings(token, settings);
      if (response.success) {
        setMessage({ type: "success", text: "Ayarlar başarıyla kaydedildi!" });
      } else {
        setMessage({ type: "error", text: response.error || "Ayarlar kaydedilemedi" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Bir hata oluştu" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">Ayarlar</h1>
        <p className="text-sm lg:text-base text-gray-400">Site ayarlarını yapılandırın</p>
      </div>

      {message && (
        <div
          className={`mb-4 lg:mb-6 p-3 lg:p-4 rounded-lg text-sm lg:text-base ${
            message.type === "success"
              ? "bg-green-500/20 border border-green-500/50 text-green-400"
              : "bg-red-500/20 border border-red-500/50 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* General Settings */}
        <div className="bg-secondary rounded-xl p-4 lg:p-6 border border-white/5">
          <h3 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6">Genel Ayarlar</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Adı
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ana Renk
                </label>
                <div className="flex items-center gap-2 lg:gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 min-w-0 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  İkincil Renk
                </label>
                <div className="flex items-center gap-2 lg:gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-lg cursor-pointer flex-shrink-0"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 min-w-0 px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-secondary rounded-xl p-4 lg:p-6 border border-white/5">
          <h3 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6">Sosyal Medya</h3>

          <div className="space-y-3 lg:space-y-4">
            {[
              { key: "socialDiscord", label: "Discord", placeholder: "https://discord.gg/..." },
              { key: "socialTelegram", label: "Telegram", placeholder: "https://t.me/..." },
              { key: "socialTwitch", label: "Twitch", placeholder: "https://twitch.tv/..." },
              { key: "socialKick", label: "Kick", placeholder: "https://kick.com/..." },
              { key: "socialYoutube", label: "YouTube", placeholder: "https://youtube.com/..." },
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {item.label}
                </label>
                <input
                  type="url"
                  value={settings[item.key]}
                  onChange={(e) => setSettings({ ...settings, [item.key]: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  placeholder={item.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Promotion & Popup Settings */}
        <div className="bg-secondary rounded-xl p-4 lg:p-6 border border-white/5 lg:col-span-2">
          <h3 className="text-base lg:text-lg font-semibold text-white mb-4 lg:mb-6">Promosyon & Popup Ayarları</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-3 lg:space-y-4">
              <h4 className="text-sm font-medium text-gold">Promosyon Banner</h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reklam ID (Ad ID)
                </label>
                <input
                  type="text"
                  value={settings.promotionAdId}
                  onChange={(e) => setSettings({ ...settings, promotionAdId: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  placeholder="Yönlendirilecek reklam ID'si"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={settings.promotionTitle}
                  onChange={(e) => setSettings({ ...settings, promotionTitle: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  placeholder="Özel Kayıt Bonusu"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={settings.promotionDescription}
                  onChange={(e) => setSettings({ ...settings, promotionDescription: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  placeholder="İlk üyeliğinize özel %300 hoşgeldin bonusu!"
                />
              </div>
            </div>

            <div className="space-y-3 lg:space-y-4">
              <h4 className="text-sm font-medium text-gold">Exit Popup</h4>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Reklam ID (Ad ID)
                </label>
                <input
                  type="text"
                  value={settings.exitPopupAdId}
                  onChange={(e) => setSettings({ ...settings, exitPopupAdId: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  placeholder="Yönlendirilecek reklam ID'si"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Başlık
                </label>
                <input
                  type="text"
                  value={settings.exitPopupTitle}
                  onChange={(e) => setSettings({ ...settings, exitPopupTitle: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  placeholder="Özel Fırsatı Kaçırma!"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={settings.exitPopupDescription}
                  onChange={(e) => setSettings({ ...settings, exitPopupDescription: e.target.value })}
                  className="w-full px-3 lg:px-4 py-2.5 lg:py-3 rounded-lg bg-background border border-white/10 text-white text-sm lg:text-base focus:outline-none focus:border-gold/50"
                  placeholder="Şimdi kayıt ol ve 200 FREE SPIN + %300 Hoşgeldin Bonusu kazan!"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button - Fixed on mobile */}
      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto">
          {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </Button>
      </div>
    </AdminShell>
  );
}
