"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function RedirectPage() {
  const params = useParams();
  const id = params.id as string;
  const [status, setStatus] = useState<"loading" | "error">("loading");

  useEffect(() => {
    if (!id) return;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    
    // Redirect to backend which will handle tracking and redirect
    window.location.href = `${API_URL}/go/${id}`;
  }, [id]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        {status === "loading" && (
          <>
            <div className="animate-spin w-12 h-12 border-4 border-gold border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white text-lg">Yönlendiriliyorsunuz...</p>
            <p className="text-gray-500 text-sm mt-2">Lütfen bekleyin</p>
          </>
        )}
        {status === "error" && (
          <>
            <p className="text-red-400 text-lg mb-4">Bir hata oluştu</p>
            <a href="/" className="text-gold hover:underline">
              Ana sayfaya dön
            </a>
          </>
        )}
      </div>
    </div>
  );
}
