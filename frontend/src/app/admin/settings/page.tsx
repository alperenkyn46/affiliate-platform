"use client";

import { useState } from "react";
import { AdminShell } from "@/components/admin";
import { Button } from "@/components/ui";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "CasinoHub",
    primaryColor: "#d4af37",
    secondaryColor: "#1a1a1a",
    socialDiscord: "#",
    socialTelegram: "#",
    socialTwitch: "#",
    socialKick: "#",
    socialYoutube: "#",
  });

  const handleSave = () => {
    alert("Ayarlar kaydedildi! (Database bağlantısı gerekli)");
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Ayarlar</h1>
        <p className="text-gray-400">Site ayarlarını yapılandırın</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-secondary rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6">Genel Ayarlar</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site Adı
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ana Renk
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  İkincil Renk
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="w-12 h-12 rounded-lg cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-secondary rounded-xl p-6 border border-white/5">
          <h3 className="text-lg font-semibold text-white mb-6">Sosyal Medya</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Discord
              </label>
              <input
                type="url"
                value={settings.socialDiscord}
                onChange={(e) => setSettings({ ...settings, socialDiscord: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                placeholder="https://discord.gg/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Telegram
              </label>
              <input
                type="url"
                value={settings.socialTelegram}
                onChange={(e) => setSettings({ ...settings, socialTelegram: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                placeholder="https://t.me/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Twitch
              </label>
              <input
                type="url"
                value={settings.socialTwitch}
                onChange={(e) => setSettings({ ...settings, socialTwitch: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                placeholder="https://twitch.tv/..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube
              </label>
              <input
                type="url"
                value={settings.socialYoutube}
                onChange={(e) => setSettings({ ...settings, socialYoutube: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={handleSave}>Ayarları Kaydet</Button>
      </div>
    </AdminShell>
  );
}
