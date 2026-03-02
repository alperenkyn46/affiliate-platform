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
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Ayarlar</h1>
        <p className="text-gray-400">Site ayarlarını yapılandırın</p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-500/20 border border-green-500/50 text-green-400"
              : "bg-red-500/20 border border-red-500/50 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

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
                Kick
              </label>
              <input
                type="url"
                value={settings.socialKick}
                onChange={(e) => setSettings({ ...settings, socialKick: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                placeholder="https://kick.com/..."
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
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Kaydediliyor..." : "Ayarları Kaydet"}
        </Button>
      </div>
    </AdminShell>
  );
}
