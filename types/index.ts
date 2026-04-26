export interface Link {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  destination_url: string;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  created_at: string;
  click_count?: number;
}

export interface Click {
  id: string;
  link_id: string;
  referrer: string | null;
  device: string | null;
  country: string | null;
  user_agent: string | null;
  timestamp: string;
}

export interface AnalyticsData {
  totalClicks: number;
  platformBreakdown: PlatformStat[];
  deviceBreakdown: DeviceStat[];
  countryBreakdown: CountryStat[];
  recentClicks: Click[];
}

export interface PlatformStat {
  platform: string;
  count: number;
  percentage: number;
}

export interface DeviceStat {
  device: string;
  count: number;
  percentage: number;
}

export interface CountryStat {
  country: string;
  count: number;
  percentage: number;
}

export interface CreateLinkPayload {
  name: string;
  destination_url: string;
  slug?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}
