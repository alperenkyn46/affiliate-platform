"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import { Button, Badge } from "@/components/ui";

interface Affiliate {
  id: number;
  name: string;
  email: string;
  tracking_code: string;
  commission_rate: number;
  status: string;
  total_clicks: number;
  total_earnings: number;
  created_at: string;
}

export default function AdminAffiliatesPage() {
  const { token } = useAuth();
  const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", commission_rate: "0" });

  useEffect(() => {
    if (token) loadAffiliates();
  }, [token]);

  const loadAffiliates = async () => {
    if (!token) return;
    try {
      const response = await api.getAdminAffiliates(token);
      if (response.success && response.data) {
        setAffiliates(response.data as Affiliate[]);
      }
    } catch (error) {
      console.error("Failed to load affiliates:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    try {
      await api.createAffiliate(token, { ...formData, commission_rate: parseFloat(formData.commission_rate) });
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", commission_rate: "0" });
      loadAffiliates();
    } catch (error) {
      console.error("Failed to create affiliate:", error);
    }
  };

  const handleStatusToggle = async (aff: Affiliate) => {
    if (!token) return;
    const newStatus = aff.status === "active" ? "inactive" : "active";
    try {
      await api.updateAffiliate(token, aff.id, { name: aff.name, email: aff.email, commission_rate: aff.commission_rate, status: newStatus });
      loadAffiliates();
    } catch (error) {
      console.error("Failed to update affiliate:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Bu affiliate hesabını silmek istediğinizden emin misiniz?")) return;
    try {
      await api.deleteAffiliate(token, id);
      loadAffiliates();
    } catch (error) {
      console.error("Failed to delete affiliate:", error);
    }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Affiliate Yönetimi</h1>
          <p className="text-gray-400">Partner hesaplarını yönetin</p>
        </div>
        <Button onClick={() => setShowModal(true)}>+ Yeni Affiliate</Button>
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
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Partner</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Takip Kodu</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Komisyon</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Tıklama</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Durum</th>
                <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {affiliates.map((aff) => (
                <tr key={aff.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{aff.name}</p>
                    <p className="text-gray-500 text-sm">{aff.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <code className="text-gold bg-gold/10 px-2 py-1 rounded text-sm">{aff.tracking_code}</code>
                  </td>
                  <td className="px-6 py-4 text-gray-300">%{aff.commission_rate}</td>
                  <td className="px-6 py-4 text-white font-semibold">{aff.total_clicks}</td>
                  <td className="px-6 py-4">
                    <Badge variant={aff.status === "active" ? "success" : "default"}>
                      {aff.status === "active" ? "Aktif" : "Pasif"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleStatusToggle(aff)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors text-sm">
                        {aff.status === "active" ? "Durdur" : "Aktifle"}
                      </button>
                      <button onClick={() => handleDelete(aff.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
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
          {affiliates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Henüz affiliate hesabı yok</p>
              <Button onClick={() => setShowModal(true)}>İlk Affiliate&apos;i Ekle</Button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl w-full max-w-lg">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">Yeni Affiliate Ekle</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ad Soyad *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-posta *</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Şifre *</label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Komisyon Oranı (%)</label>
                <input type="number" step="0.01" value={formData.commission_rate} onChange={(e) => setFormData({ ...formData, commission_rate: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => setShowModal(false)}>İptal</Button>
                <Button type="submit" className="flex-1">Oluştur</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
