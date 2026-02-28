"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import { Button, Badge } from "@/components/ui";

interface Ad {
  id: number;
  title: string;
  description: string;
  bonus: string;
  bonus_details: string;
  image: string;
  link: string;
  position: number;
  status: string;
  featured: boolean;
  click_count: number;
  created_at: string;
}

export default function AdsManagementPage() {
  const { token } = useAuth();
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    bonus: "",
    bonus_details: "",
    image: "",
    link: "",
    position: 1,
    status: "active",
    featured: false,
  });

  useEffect(() => {
    if (token) {
      loadAds();
    }
  }, [token]);

  const loadAds = async () => {
    if (!token) return;
    try {
      const response = await api.getAdminAds(token);
      if (response.success && response.data) {
        setAds(response.data as Ad[]);
      }
    } catch (error) {
      console.error("Failed to load ads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (ad?: Ad) => {
    if (ad) {
      setEditingAd(ad);
      setFormData({
        title: ad.title,
        description: ad.description || "",
        bonus: ad.bonus || "",
        bonus_details: ad.bonus_details || "",
        image: ad.image || "",
        link: ad.link,
        position: ad.position,
        status: ad.status,
        featured: ad.featured,
      });
    } else {
      setEditingAd(null);
      setFormData({
        title: "",
        description: "",
        bonus: "",
        bonus_details: "",
        image: "",
        link: "",
        position: ads.length + 1,
        status: "active",
        featured: false,
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAd(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingAd) {
        await api.updateAd(token, editingAd.id, formData);
      } else {
        await api.createAd(token, formData);
      }
      handleCloseModal();
      loadAds();
    } catch (error) {
      console.error("Failed to save ad:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Bu reklamı silmek istediğinizden emin misiniz?")) return;

    try {
      await api.deleteAd(token, id);
      loadAds();
    } catch (error) {
      console.error("Failed to delete ad:", error);
    }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Reklam Yönetimi</h1>
          <p className="text-gray-400">Reklamlarınızı ekleyin, düzenleyin ve yönetin</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Yeni Reklam</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Sıra</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Reklam</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Bonus</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Tıklama</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Durum</th>
                <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <span className="text-gray-500 font-medium">{ad.position}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center">
                        <span className="text-gold font-bold">{ad.title[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{ad.title}</p>
                        <p className="text-gray-500 text-sm truncate max-w-[200px]">
                          {ad.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gold font-medium">{ad.bonus}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white font-semibold">
                      {(ad.click_count || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Badge variant={ad.status === "active" ? "success" : "default"}>
                        {ad.status === "active" ? "Aktif" : "Pasif"}
                      </Badge>
                      {ad.featured && <Badge variant="gold">Öne Çıkan</Badge>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(ad)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(ad.id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {ads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Henüz reklam eklenmemiş</p>
              <Button onClick={() => handleOpenModal()}>İlk Reklamı Ekle</Button>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">
                {editingAd ? "Reklamı Düzenle" : "Yeni Reklam Ekle"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Site Adı *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Açıklama
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bonus
                  </label>
                  <input
                    type="text"
                    value={formData.bonus}
                    onChange={(e) => setFormData({ ...formData, bonus: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                    placeholder="%150 Bonus"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bonus Detay
                  </label>
                  <input
                    type="text"
                    value={formData.bonus_details}
                    onChange={(e) => setFormData({ ...formData, bonus_details: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                    placeholder="500₺'ye kadar"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Affiliate Link *
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                    min={1}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Durum
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Pasif</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-5 h-5 rounded border-white/10 bg-background text-gold focus:ring-gold"
                />
                <label htmlFor="featured" className="text-gray-300">
                  Öne çıkan reklam olarak göster
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={handleCloseModal}>
                  İptal
                </Button>
                <Button type="submit" className="flex-1">
                  {editingAd ? "Güncelle" : "Ekle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
