export interface Ad {
  id: number;
  title: string;
  description: string;
  bonus: string;
  bonusDetails?: string;
  bonus_details?: string; // Database field name
  image: string;
  link: string;
  position: number;
  featured?: boolean | number; // MySQL returns 0/1
  rating?: number;
  tags?: string[] | string; // Can be JSON string from DB
  status?: string;
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
