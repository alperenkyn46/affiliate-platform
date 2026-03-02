"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { api } from "@/lib/api";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  category: string;
  views: number;
  published_at: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await api.getBlogPosts({ limit: 20 });
      if (response.success && response.data) {
        setPosts(response.data as BlogPost[]);
      }
    } catch (error) {
      console.error("Failed to load posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Blog</h1>
          <p className="text-gray-400 mb-8">Casino incelemeleri, bonus rehberleri ve daha fazlası</p>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Henüz blog yazısı bulunmuyor.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group bg-secondary rounded-xl border border-white/5 overflow-hidden hover:border-gold/30 transition-all"
                >
                  {post.cover_image && (
                    <div className="aspect-video bg-background/50 overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    {post.category && (
                      <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium mb-3">
                        {post.category}
                      </span>
                    )}
                    <h2 className="text-lg font-semibold text-white group-hover:text-gold transition-colors mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
                      <span>{new Date(post.published_at).toLocaleDateString("tr-TR")}</span>
                      <span>{post.views} görüntülenme</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
