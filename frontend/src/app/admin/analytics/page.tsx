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
      const response = await api.getAnalytics(token);
      if (response.success && response.data) {
        setData(response.data as AnalyticsData);
      }
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxValue = Math.max(
    ...(data?.visitors?.map((v) => v.count) || [1]),
    ...(data?.clicks?.map((c) => c.count) || [1])
  );

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Analitik</h1>
        <p className="text-gray-400">Detaylı trafik ve tıklama istatistikleri</p>
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
            <div className="h-64 flex items-end gap-2">
              {data?.visitors?.map((item, index) => (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-gold to-gold-light rounded-t transition-all duration-500 hover:opacity-80"
                    style={{
                      height: `${(item.count / maxValue) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Clicks Chart */}
          <div className="bg-secondary rounded-xl p-6 border border-white/5">
            <h3 className="text-lg font-semibold text-white mb-6">Günlük Tıklamalar</h3>
            <div className="h-64 flex items-end gap-2">
              {data?.clicks?.map((item, index) => (
                <div
                  key={item.date}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-500 hover:opacity-80"
                    style={{
                      height: `${(item.count / maxValue) * 100}%`,
                      minHeight: "4px",
                    }}
                  />
                  <span className="text-xs text-gray-500">
                    {new Date(item.date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </AdminShell>
  );
}
