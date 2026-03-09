"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import LineChart from "@/components/admin/LineChart";

interface AnalyticsData {
  clicks: { date: string; count: number }[];
  visitors: { date: string; count: number }[];
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"7" | "14" | "30">("30");

  useEffect(() => {
    if (token) {
      loadAnalytics();
    }
  }, [token, dateRange]);

  const loadAnalytics = async () => {
    if (!token) return;
    try {
      setIsLoading(true);
      const days = parseInt(dateRange);
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      
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

  const totalVisitors = data?.visitors?.reduce((sum, v) => sum + v.count, 0) || 0;
  const totalClicks = data?.clicks?.reduce((sum, c) => sum + c.count, 0) || 0;
  const avgVisitors = data?.visitors?.length ? Math.round(totalVisitors / data.visitors.length) : 0;
  const avgClicks = data?.clicks?.length ? Math.round(totalClicks / data.clicks.length) : 0;
  const conversionRate = totalVisitors > 0 ? ((totalClicks / totalVisitors) * 100).toFixed(1) : "0";

  return (
    <AdminShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 lg:mb-8">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">Analitik</h1>
          <p className="text-sm lg:text-base text-gray-400">Detaylı trafik ve tıklama istatistikleri</p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex gap-2">
          {[
            { value: "7", label: "7 Gün" },
            { value: "14", label: "14 Gün" },
            { value: "30", label: "30 Gün" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setDateRange(option.value as "7" | "14" | "30")}
              className={`px-3 py-1.5 lg:px-4 lg:py-2 rounded-lg text-sm font-medium transition-all ${
                dateRange === option.value
                  ? "bg-gold text-background"
                  : "bg-secondary text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4 mb-6 lg:mb-8">
            <div className="bg-secondary rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-xs lg:text-sm mb-1">Toplam Ziyaretçi</p>
              <p className="text-xl lg:text-2xl font-bold text-gold">{totalVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-xs lg:text-sm mb-1">Toplam Tıklama</p>
              <p className="text-xl lg:text-2xl font-bold text-blue-400">{totalClicks.toLocaleString()}</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-xs lg:text-sm mb-1">Ort. Günlük Ziyaretçi</p>
              <p className="text-xl lg:text-2xl font-bold text-green-400">{avgVisitors.toLocaleString()}</p>
            </div>
            <div className="bg-secondary rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-xs lg:text-sm mb-1">Ort. Günlük Tıklama</p>
              <p className="text-xl lg:text-2xl font-bold text-purple-400">{avgClicks.toLocaleString()}</p>
            </div>
            <div className="col-span-2 lg:col-span-1 bg-secondary rounded-xl p-4 border border-white/5">
              <p className="text-gray-400 text-xs lg:text-sm mb-1">Dönüşüm Oranı</p>
              <p className="text-xl lg:text-2xl font-bold text-orange-400">{conversionRate}%</p>
            </div>
          </div>

          {/* Visitors Chart */}
          <div className="bg-secondary rounded-xl p-4 lg:p-6 border border-white/5 mb-4 lg:mb-6">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="w-3 h-3 rounded-full bg-gold"></div>
              <h3 className="text-base lg:text-lg font-semibold text-white">Günlük Ziyaretçiler</h3>
            </div>
            <LineChart
              data={data?.visitors || []}
              color="#d4af37"
              gradientFrom="#d4af37"
              gradientTo="#f5d65a"
              label="ziyaretçi"
            />
          </div>

          {/* Clicks Chart */}
          <div className="bg-secondary rounded-xl p-4 lg:p-6 border border-white/5">
            <div className="flex items-center gap-3 mb-4 lg:mb-6">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="text-base lg:text-lg font-semibold text-white">Günlük Tıklamalar</h3>
            </div>
            <LineChart
              data={data?.clicks || []}
              color="#3b82f6"
              gradientFrom="#3b82f6"
              gradientTo="#60a5fa"
              label="tıklama"
            />
          </div>
        </>
      )}
    </AdminShell>
  );
}
