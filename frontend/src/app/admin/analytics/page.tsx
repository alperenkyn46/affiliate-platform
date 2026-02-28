"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";

interface AnalyticsData {
  clicks: { date: string; count: number }[];
  visitors: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadAnalytics();
    }
  }, [token]);

  const loadAnalytics = async () => {
    if (!token) return;
    try {
      // Son 30 günü al
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      
      const response = await api.getAnalytics(token, startDate, endDate);
      if (response.success && response.data) {
        setData(response.data as AnalyticsData);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasVisitorData = data?.visitors && data.visitors.length > 0;
  const hasClickData = data?.clicks && data.clicks.length > 0;

  const maxValue = Math.max(
    ...(data?.visitors?.map((v) => v.count) || [1]),
    ...(data?.clicks?.map((c) => c.count) || [1]),
    1
  );

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Analitik</h1>
        <p className="text-gray-400">Detaylı trafik ve tıklama istatistikleri (Son 30 Gün)</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Visitors Chart */}
          <div className="bg-secondary rounded-xl p-6 border border-white/5 mb-6">
            <h3 className="text-lg font-semibold text-white mb-6">Günlük Ziyaretçiler</h3>
            {hasVisitorData ? (
              <div className="h-64 flex items-end gap-2">
                {data?.visitors?.map((item) => (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-gold font-medium">{item.count}</span>
                    <div
                      className="w-full bg-gradient-to-t from-gold to-gold-light rounded-t transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${Math.max((item.count / maxValue) * 100, 5)}%`,
                        minHeight: "8px",
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">Henüz ziyaretçi verisi yok</p>
                  <p className="text-sm">Siteye ziyaretçi geldikçe veriler burada görünecek</p>
                </div>
              </div>
            )}
          </div>

          {/* Clicks Chart */}
          <div className="bg-secondary rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-6">Günlük Tıklamalar</h3>
            {hasClickData ? (
              <div className="h-64 flex items-end gap-2">
                {data?.clicks?.map((item) => (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs text-blue-400 font-medium">{item.count}</span>
                    <div
                      className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${Math.max((item.count / maxValue) * 100, 5)}%`,
                        minHeight: "8px",
                      }}
                    />
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-lg mb-2">Henüz tıklama verisi yok</p>
                  <p className="text-sm">Reklamlara tıklandıkça veriler burada görünecek</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-secondary rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-sm">Toplam Ziyaretçi (30 gün)</p>
              <p className="text-2xl font-bold text-gold">
                {data?.visitors?.reduce((sum, v) => sum + v.count, 0) || 0}
              </p>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-sm">Toplam Tıklama (30 gün)</p>
              <p className="text-2xl font-bold text-blue-400">
                {data?.clicks?.reduce((sum, c) => sum + c.count, 0) || 0}
              </p>
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
