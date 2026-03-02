"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell, StatsCard } from "@/components/admin";

interface EndpointStat {
  endpoint: string;
  method: string;
  requests: number;
  avg_response_time: number;
  max_response_time: number;
}

interface ApiStatsData {
  endpointStats: EndpointStat[];
  hourlyStats: { hour: number; requests: number }[];
  totalRequests: number;
  avgResponseTime: number;
}

export default function ApiStatsPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<ApiStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) loadStats();
  }, [token]);

  const loadStats = async () => {
    if (!token) return;
    try {
      const response = await api.getApiStats(token);
      if (response.success && response.data) {
        setStats(response.data as ApiStatsData);
      }
    } catch (error) {
      console.error("Failed to load API stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const methodColor = (method: string) => {
    switch (method) {
      case "GET": return "text-green-400";
      case "POST": return "text-blue-400";
      case "PUT": return "text-yellow-400";
      case "DELETE": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">API İstatistikleri</h1>
        <p className="text-gray-400">Son 24 saatlik API kullanım verileri</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : stats ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <StatsCard title="Toplam İstek" value={stats.totalRequests.toLocaleString()} icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            } />
            <StatsCard title="Ort. Yanıt Süresi" value={`${stats.avgResponseTime}ms`} icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            } />
          </div>

          <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden mb-8">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">Saatlik İstek Dağılımı</h3>
            </div>
            <div className="p-6">
              <div className="flex items-end gap-1 h-40">
                {Array.from({ length: 24 }, (_, i) => {
                  const hourData = stats.hourlyStats.find(h => h.hour === i);
                  const requests = hourData?.requests || 0;
                  const maxRequests = Math.max(...stats.hourlyStats.map(h => h.requests), 1);
                  const height = (requests / maxRequests) * 100;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full bg-gold/20 rounded-t relative" style={{ height: `${Math.max(height, 2)}%` }}>
                        <div className="absolute inset-0 bg-gold/60 rounded-t" />
                      </div>
                      <span className="text-[10px] text-gray-500">{i}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-lg font-semibold text-white">Endpoint İstatistikleri</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-6 py-3 text-gray-400 font-medium text-sm">Endpoint</th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium text-sm">Method</th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium text-sm">İstek</th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium text-sm">Ort. Süre</th>
                  <th className="text-left px-6 py-3 text-gray-400 font-medium text-sm">Max Süre</th>
                </tr>
              </thead>
              <tbody>
                {stats.endpointStats.map((ep, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td className="px-6 py-3 text-white font-mono text-sm">{ep.endpoint}</td>
                    <td className={`px-6 py-3 font-semibold text-sm ${methodColor(ep.method)}`}>{ep.method}</td>
                    <td className="px-6 py-3 text-gray-300">{ep.requests}</td>
                    <td className="px-6 py-3 text-gray-300">{Math.round(ep.avg_response_time)}ms</td>
                    <td className="px-6 py-3 text-gray-300">{ep.max_response_time}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">Veri yüklenemedi</div>
      )}
    </AdminShell>
  );
}
