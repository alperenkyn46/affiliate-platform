"use client";

import { useState } from "react";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import { api } from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const response = await api.submitContact(formData);
      if (response.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">İletişim</h1>
          <p className="text-gray-400 mb-8">
            Sorularınız veya önerileriniz için bizimle iletişime geçin.
          </p>

          {status === "success" && (
            <div className="mb-6 p-4 rounded-lg bg-green-500/20 border border-green-500/50 text-green-400">
              Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
            </div>
          )}

          {status === "error" && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 text-red-400">
              Mesaj gönderilemedi. Lütfen tekrar deneyin.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Ad Soyad</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-white focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">E-posta</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-white focus:outline-none focus:border-gold/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Konu</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-white focus:outline-none focus:border-gold/50"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mesaj</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-secondary border border-white/10 text-white focus:outline-none focus:border-gold/50 resize-none"
                required
              />
            </div>

            <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto">
              {status === "sending" ? "Gönderiliyor..." : "Mesaj Gönder"}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
