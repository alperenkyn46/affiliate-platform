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
  rating: number;
  tags: string[];
  click_count: number;
  created_at: string;
}

const AVAILABLE_TAGS = ["Yeni", "Popüler", "Premium", "VIP", "Özel", "Sınırlı"];

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
    rating: 4.5,
    tags: [] as string[],
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
      const adTags = Array.isArray(ad.tags) 
        ? ad.tags 
        : typeof ad.tags === 'string' 
          ? JSON.parse(ad.tags || '[]') 
          : [];
      const adRating = typeof ad.rating === 'string' ? parseFloat(ad.rating) : (ad.rating || 4.5);
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
        rating: isNaN(adRating) ? 4.5 : adRating,
        tags: adTags,
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
        rating: 4.5,
        tags: [],
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">Reklam Yönetimi</h1>
          <p className="text-sm lg:text-base text-gray-400">Reklamlarınızı ekleyin ve yönetin</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Yeni Reklam</Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-secondary rounded-xl border border-white/5 overflow-hidden">
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
                        <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                          <span className="text-gold font-bold">{ad.title[0]}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-white font-medium truncate">{ad.title}</p>
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
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={ad.status === "active" ? "success" : "default"}>
                          {ad.status === "active" ? "Aktif" : "Pasif"}
                        </Badge>
                        {ad.featured && <Badge variant="gold">Öne Çıkan</Badge>}
                        {ad.rating && (
                          <span className="flex items-center gap-1 text-gold text-sm">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            {ad.rating}
                          </span>
                        )}
                      </div>
                      {ad.tags && ad.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(Array.isArray(ad.tags) ? ad.tags : []).map((tag: string) => (
                            <span key={tag} className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
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

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {ads.map((ad) => (
              <div key={ad.id} className="bg-secondary rounded-xl p-4 border border-white/5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-gold font-bold text-lg">{ad.title[0]}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-semibold truncate">{ad.title}</p>
                      <p className="text-gray-500 text-sm truncate">{ad.description}</p>
                    </div>
                  </div>
                  <span className="text-gray-500 text-sm font-medium flex-shrink-0">#{ad.position}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge variant={ad.status === "active" ? "success" : "default"}>
                    {ad.status === "active" ? "Aktif" : "Pasif"}
                  </Badge>
                  {ad.featured && <Badge variant="gold">Öne Çıkan</Badge>}
                  {ad.rating && (
                    <span className="flex items-center gap-1 text-gold text-sm">
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {ad.rating}
                    </span>
                  )}
                  {ad.tags && ad.tags.length > 0 && (
                    (Array.isArray(ad.tags) ? ad.tags : []).map((tag: string) => (
                      <span key={tag} className="text-xs bg-gold/20 text-gold px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Bonus:</span>
                      <span className="text-gold ml-1 font-medium">{ad.bonus}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Tıklama:</span>
                      <span className="text-white ml-1 font-semibold">{(ad.click_count || 0).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
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
                </div>
              </div>
            ))}

            {ads.length === 0 && (
              <div className="bg-secondary rounded-xl p-8 border border-white/5 text-center">
                <p className="text-gray-500 mb-4">Henüz reklam eklenmemiş</p>
                <Button onClick={() => handleOpenModal()}>İlk Reklamı Ekle</Button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-secondary p-4 lg:p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg lg:text-xl font-bold text-white">
                {editingAd ? "Reklamı Düzenle" : "Yeni Reklam Ekle"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Yıldız Değeri
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="flex-1 h-2 bg-background rounded-lg appearance-none cursor-pointer accent-gold"
                  />
                  <div className="flex items-center gap-1 min-w-[60px]">
                    <svg className="w-5 h-5 fill-gold" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-gold font-semibold">{Number(formData.rating).toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Etiketler
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (formData.tags.includes(tag)) {
                          setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
                        } else {
                          setFormData({ ...formData, tags: [...formData.tags, tag] });
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        formData.tags.includes(tag)
                          ? "bg-gold text-background"
                          : "bg-background border border-white/10 text-gray-400 hover:border-gold/50 hover:text-white"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {formData.tags.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Seçili: {formData.tags.join(", ")}
                  </p>
                )}
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
