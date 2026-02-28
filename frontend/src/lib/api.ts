function getApiUrl(): string {
  // Server-side veya build time
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  }
  
  // Client-side: Eğer localhost değilse, mevcut hostname'i kullan
  const hostname = window.location.hostname;
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
  }
  
  // LAN erişimi: Aynı hostname'i backend portuyla kullan
  return `http://${hostname}:5000/api`;
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
};

export default api;
