"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell, StatsCard } from "@/components/admin";

interface DashboardData {
  totalVisitors: number;
  todayVisitors: number;
  totalClicks: number;
  todayClicks: number;
  topAds: { id: number; title: string; clicks: number }[];
  deviceStats: { mobile: number; desktop: number };
}

export default function AdminDashboard() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadDashboard();
    }
  }, [token]);

  const loadDashboard = async () => {
    if (!token) return;
    try {
      const response = await api.getDashboard(token);
      if (response.success && response.data) {
        setData(response.data as DashboardData);
      }
    } catch (error) {
      console.error("Failed to load dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Site istatistiklerinize genel bakış</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Toplam Ziyaretçi"
              value={data?.totalVisitors || 0}
              change={12}
              color="gold"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Bugünkü Ziyaretçi"
              value={data?.todayVisitors || 0}
              change={5}
              color="green"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
            />
            <StatsCard
              title="Toplam Tıklama"
              value={data?.totalClicks || 0}
              change={18}
              color="blue"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              }
            />
            <StatsCard
              title="Bugünkü Tıklama"
              value={data?.todayClicks || 0}
              change={-3}
              color="purple"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              }
            />
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Ads */}
            <div className="bg-secondary rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">En Çok Tıklanan Reklamlar</h3>
              <div className="space-y-3">
                {data?.topAds?.map((ad, index) => (
                  <div
                    key={ad.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-background/50"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? "bg-gold/20 text-gold"
                            : index === 1
                            ? "bg-gray-400/20 text-gray-400"
                            : index === 2
                            ? "bg-orange-500/20 text-orange-500"
                            : "bg-white/10 text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                      <span className="text-white font-medium">{ad.title}</span>
                    </div>
                    <span className="text-gold font-semibold">{ad.clicks.toLocaleString()}</span>
                  </div>
                ))}
                {(!data?.topAds || data.topAds.length === 0) && (
                  <p className="text-gray-500 text-center py-4">Henüz veri yok</p>
                )}
              </div>
            </div>

            {/* Device Stats */}
            <div className="bg-secondary rounded-xl p-6 border border-white/5">
              <h3 className="text-lg font-semibold text-white mb-4">Cihaz Dağılımı</h3>
              <div className="space-y-4">
                {/* Mobile */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      Mobil
                    </span>
                    <span className="text-white font-semibold">{data?.deviceStats?.mobile || 0}%</span>
                  </div>
                  <div className="h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-500"
                      style={{ width: `${data?.deviceStats?.mobile || 0}%` }}
                    />
                  </div>
                </div>

                {/* Desktop */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Masaüstü
                    </span>
                    <span className="text-white font-semibold">{data?.deviceStats?.desktop || 0}%</span>
                  </div>
                  <div className="h-3 bg-background rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-500"
                      style={{ width: `${data?.deviceStats?.desktop || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
