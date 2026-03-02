"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import { Badge } from "@/components/ui";

interface Review {
  id: number;
  ad_title: string;
  author_name: string;
  author_email: string;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
}

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) loadReviews();
  }, [token]);

  const loadReviews = async () => {
    if (!token) return;
    try {
      const response = await api.getAdminReviews(token);
      if (response.success && response.data) {
        setReviews(response.data as Review[]);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatus = async (id: number, status: string) => {
    if (!token) return;
    try {
      await api.updateReviewStatus(token, id, status);
      loadReviews();
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  };

  return (
    <AdminShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Yorum Yönetimi</h1>
        <p className="text-gray-400">Kullanıcı yorumlarını onaylayın veya reddedin</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-secondary rounded-xl p-6 border border-white/5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-white font-medium">{review.author_name}</p>
                  <p className="text-gray-500 text-sm">{review.ad_title} - {new Date(review.created_at).toLocaleDateString("tr-TR")}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={star <= review.rating ? "text-gold" : "text-gray-600"}>★</span>
                    ))}
                  </div>
                  <Badge variant={review.status === "approved" ? "success" : review.status === "rejected" ? "default" : "gold"}>
                    {review.status === "approved" ? "Onaylı" : review.status === "rejected" ? "Reddedildi" : "Beklemede"}
                  </Badge>
                </div>
              </div>
              {review.comment && <p className="text-gray-300 mb-4">{review.comment}</p>}
              {review.status === "pending" && (
                <div className="flex gap-2">
                  <button onClick={() => handleStatus(review.id, "approved")} className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm">
                    Onayla
                  </button>
                  <button onClick={() => handleStatus(review.id, "rejected")} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm">
                    Reddet
                  </button>
                </div>
              )}
            </div>
          ))}
          {reviews.length === 0 && (
            <div className="text-center py-12 text-gray-500">Henüz yorum bulunmuyor</div>
          )}
        </div>
      )}
    </AdminShell>
  );
}
