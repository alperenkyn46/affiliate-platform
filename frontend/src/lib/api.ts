function getApiUrl(): string {
  // Production: Environment variable kullan
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Development: localhost veya LAN
  if (typeof window === "undefined") {
    return "http://localhost:5000/api";
  }
  
  const hostname = window.location.hostname;
  
  // Localhost
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "http://localhost:5000/api";
  }
  
  // LAN erişimi (192.168.x.x, 10.x.x.x gibi)
  if (hostname.match(/^(192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/)) {
    return `http://${hostname}:5000/api`;
  }
  
  // Production fallback - bu duruma düşmemeli
  return "http://localhost:5000/api";
}

const API_URL = getApiUrl();

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, error: "Network error" };
  }
}

export const api = {
  // Public Settings (no auth)
  getPublicSettings: () => fetchApi("/settings"),

  // Ads
  getAds: (params?: { featured?: boolean }) => {
    const query = params?.featured !== undefined ? `?featured=${params.featured}` : "";
    return fetchApi(`/ads${query}`);
  },

  getAdById: (id: number) => fetchApi(`/ads/${id}`),

  // Visitors
  recordVisitor: (pageUrl: string) =>
    fetchApi("/visitors", {
      method: "POST",
      body: JSON.stringify({ page_url: pageUrl }),
    }),

  // Auth
  login: (username: string, password: string) =>
    fetchApi("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }),

  getCurrentUser: (token: string) =>
    fetchApi("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Admin
  getDashboard: (token: string) =>
    fetchApi("/admin/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getAdminAds: (token: string) =>
    fetchApi("/admin/ads", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createAd: (token: string, data: Record<string, unknown>) =>
    fetchApi("/admin/ads", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  updateAd: (token: string, id: number, data: Record<string, unknown>) =>
    fetchApi(`/admin/ads/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  deleteAd: (token: string, id: number) =>
    fetchApi(`/admin/ads/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  getAnalytics: (token: string, startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append("start_date", startDate);
    if (endDate) params.append("end_date", endDate);
    return fetchApi(`/admin/analytics?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  // Advanced Analytics
  getConversionAnalytics: (token: string) =>
    fetchApi("/admin/analytics/conversions", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  getFunnelAnalytics: (token: string) =>
    fetchApi("/admin/analytics/funnel", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Settings
  getSettings: (token: string) =>
    fetchApi("/admin/settings", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateSettings: (token: string, data: Record<string, string>) =>
    fetchApi("/admin/settings", {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  submitContact: (data: { name: string; email: string; subject: string; message: string }) =>
    fetchApi("/contact", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Blog
  getBlogPosts: (params?: { category?: string; limit?: number; offset?: number; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.offset) query.append("offset", params.offset.toString());
    if (params?.q) query.append("q", params.q);
    return fetchApi(`/blog?${query}`);
  },

  getBlogPost: (slug: string) => fetchApi(`/blog/${slug}`),

  getBlogCategories: () => fetchApi("/blog/categories"),

  // Admin Blog
  getAdminBlogPosts: (token: string) =>
    fetchApi("/admin/blog", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createBlogPost: (token: string, data: Record<string, unknown>) =>
    fetchApi("/admin/blog", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  updateBlogPost: (token: string, id: number, data: Record<string, unknown>) =>
    fetchApi(`/admin/blog/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  deleteBlogPost: (token: string, id: number) =>
    fetchApi(`/admin/blog/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Live Ticker
  getRecentClicks: () => fetchApi("/recent-clicks"),

  // Reviews
  getReviews: (adId: number) => fetchApi(`/reviews/${adId}`),

  submitReview: (data: { ad_id: number; author_name: string; author_email?: string; rating: number; comment?: string }) =>
    fetchApi("/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getAdminReviews: (token: string) =>
    fetchApi("/admin/reviews", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateReviewStatus: (token: string, id: number, status: string) =>
    fetchApi(`/admin/reviews/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),

  // API Stats
  getApiStats: (token: string) =>
    fetchApi("/admin/api-stats", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Affiliate
  getAdminAffiliates: (token: string) =>
    fetchApi("/admin/affiliates", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createAffiliate: (token: string, data: Record<string, unknown>) =>
    fetchApi("/admin/affiliates", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  updateAffiliate: (token: string, id: number, data: Record<string, unknown>) =>
    fetchApi(`/admin/affiliates/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),

  deleteAffiliate: (token: string, id: number) =>
    fetchApi(`/admin/affiliates/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Backups
  getBackups: (token: string) =>
    fetchApi("/admin/backups", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  createBackup: (token: string) =>
    fetchApi("/admin/backups", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }),

  // Contact Messages
  getMessages: (token: string) =>
    fetchApi("/admin/messages", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  updateMessageStatus: (token: string, id: number, status: string) =>
    fetchApi(`/admin/messages/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    }),

  deleteMessage: (token: string, id: number) =>
    fetchApi(`/admin/messages/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }),
};

export default api;
