"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { AdminShell } from "@/components/admin";
import { Button, Badge } from "@/components/ui";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  category: string;
  status: string;
  views: number;
  author_name: string;
  created_at: string;
  published_at: string;
}

export default function AdminBlogPage() {
  const { token } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    cover_image: "",
    category: "",
    status: "draft",
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    if (token) loadPosts();
  }, [token]);

  const loadPosts = async () => {
    if (!token) return;
    try {
      const response = await api.getAdminBlogPosts(token);
      if (response.success && response.data) {
        setPosts(response.data as BlogPost[]);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (post?: BlogPost) => {
    if (post) {
      setEditingPost(post);
      setFormData({
        title: post.title,
        slug: post.slug,
        excerpt: "",
        content: "",
        cover_image: "",
        category: post.category || "",
        status: post.status,
        meta_title: "",
        meta_description: "",
      });
    } else {
      setEditingPost(null);
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        cover_image: "",
        category: "",
        status: "draft",
        meta_title: "",
        meta_description: "",
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingPost) {
        await api.updateBlogPost(token, editingPost.id, formData);
      } else {
        await api.createBlogPost(token, formData);
      }
      setShowModal(false);
      setEditingPost(null);
      loadPosts();
    } catch (error) {
      console.error("Failed to save post:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!token || !confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;
    try {
      await api.deleteBlogPost(token, id);
      loadPosts();
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <AdminShell>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Blog Yönetimi</h1>
          <p className="text-gray-400">Blog yazılarınızı yönetin</p>
        </div>
        <Button onClick={() => handleOpenModal()}>+ Yeni Yazı</Button>
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
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Başlık</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Kategori</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Durum</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Görüntülenme</th>
                <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <p className="text-white font-medium">{post.title}</p>
                    <p className="text-gray-500 text-sm">{post.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{post.category || "-"}</td>
                  <td className="px-6 py-4">
                    <Badge variant={post.status === "published" ? "success" : "default"}>
                      {post.status === "published" ? "Yayında" : post.status === "draft" ? "Taslak" : "Arşiv"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{post.views}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenModal(post)} className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors">
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
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Henüz blog yazısı eklenmemiş</p>
              <Button onClick={() => handleOpenModal()}>İlk Yazıyı Ekle</Button>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-secondary rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">
                {editingPost ? "Yazıyı Düzenle" : "Yeni Blog Yazısı"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Başlık *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" placeholder="otomatik oluşturulur" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Özet</label>
                <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} rows={2} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">İçerik * (HTML)</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={10} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50 resize-none font-mono text-sm" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Durum</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50">
                    <option value="draft">Taslak</option>
                    <option value="published">Yayında</option>
                    <option value="archived">Arşiv</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kapak Görseli URL</label>
                <input type="text" value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} className="w-full px-4 py-3 rounded-lg bg-background border border-white/10 text-white focus:outline-none focus:border-gold/50" />
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" className="flex-1" onClick={() => { setShowModal(false); setEditingPost(null); }}>İptal</Button>
                <Button type="submit" className="flex-1">{editingPost ? "Güncelle" : "Oluştur"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
