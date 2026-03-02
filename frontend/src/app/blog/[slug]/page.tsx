"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header, Footer } from "@/components/layout";
import { api } from "@/lib/api";

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  category: string;
  author_name: string;
  views: number;
  published_at: string;
  meta_title: string;
  meta_description: string;
}

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      loadPost(params.slug as string);
    }
  }, [params.slug]);

  const loadPost = async (slug: string) => {
    try {
      const response = await api.getBlogPost(slug);
      if (response.success && response.data) {
        setPost(response.data as BlogPost);
      }
    } catch (error) {
      console.error("Failed to load post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full" />
            </div>
          ) : !post ? (
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-white mb-4">Yazı Bulunamadı</h1>
              <Link href="/blog" className="text-gold hover:underline">Blog&apos;a dön</Link>
            </div>
          ) : (
            <article>
              <div className="mb-8">
                <Link href="/blog" className="text-gold hover:underline text-sm mb-4 inline-block">
                  &larr; Blog&apos;a dön
                </Link>
                {post.category && (
                  <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium ml-4">
                    {post.category}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-white mt-4 mb-4">{post.title}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  {post.author_name && <span>{post.author_name}</span>}
                  <span>{new Date(post.published_at).toLocaleDateString("tr-TR")}</span>
                  <span>{post.views} görüntülenme</span>
                </div>
              </div>

              {post.cover_image && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div
                className="prose prose-invert max-w-none text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
