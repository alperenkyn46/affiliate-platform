"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import { Button } from "@/components/ui";

interface Backup {
  filename: string;
  size: number;
  created: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function BackupsPage() {
  const { token } = useAuth();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    if (token) loadBackups();
  }, [token]);

  const loadBackups = async () => {
    if (!token) return;
    try {
      const response = await api.getBackups(token);
      if (response.success && response.data) {
        setBackups(response.data as Backup[]);
      }
    } catch (error) {
      console.error("Failed to load backups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!token) return;
    setIsCreating(true);
    try {
      const response = await api.createBackup(token);
      if (response.success) {
        loadBackups();
      }
    } catch (error) {
      console.error("Failed to create backup:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Yedekler</h1>
          <p className="text-gray-400">Veritabanı yedeklerini yönetin</p>
        </div>
        <Button onClick={handleCreate} disabled={isCreating}>
          {isCreating ? "Yedekleniyor..." : "Manuel Yedek Al"}
        </Button>
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
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Dosya Adı</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Boyut</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Tarih</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup) => (
                <tr key={backup.filename} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <span className="text-white font-mono text-sm">{backup.filename}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{formatBytes(backup.size)}</td>
                  <td className="px-6 py-4 text-gray-400">{new Date(backup.created).toLocaleString("tr-TR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {backups.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Henüz yedek bulunmuyor</p>
              <Button onClick={handleCreate} disabled={isCreating}>İlk Yedeği Oluştur</Button>
            </div>
          )}
        </div>
      )}

      <div className="mt-6 p-4 rounded-lg bg-background/50 border border-white/5">
        <p className="text-gray-500 text-sm">
          Otomatik yedekler her gece saat 02:00&apos;de oluşturulur. 
          Yedekler 30 gün boyunca saklanır.
        </p>
      </div>
    </AdminShell>
  );
}
