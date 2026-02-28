export interface Ad {
  id: number;
  title: string;
  description: string;
  bonus: string;
  bonusDetails?: string;
  image: string;
  link: string;
  position: number;
  featured?: boolean;
  rating?: number;
  tags?: string[];
}

export interface Visitor {
  id: number;
  ip: string;
  device: string;
  browser: string;
  country: string;
  createdAt: string;
}

export interface Click {
  id: number;
  adId: number;
  ip: string;
  device: string;
  country: string;
  createdAt: string;
}

export interface DashboardStats {
  totalVisitors: number;
  todayVisitors: number;
  totalClicks: number;
  todayClicks: number;
  topAds: { id: number; title: string; clicks: number }[];
  deviceStats: { mobile: number; desktop: number };
}
