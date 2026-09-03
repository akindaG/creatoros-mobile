export type Platform = 'instagram' | 'facebook';
export type PostStatus = 'draft' | 'scheduled' | 'queued' | 'published' | 'failed';

export interface User {
  id: string;
  name: string;
  email: string;
  profile_image?: string | null;
  bio?: string | null;
  role?: string;
}

export interface Post {
  id: string;
  title: string;
  caption?: string | null;
  media_url?: string | null;
  platform: Platform;
  status: PostStatus;
  scheduled_time?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface SocialAccount {
  id: string;
  platform: Platform;
  account_name: string;
  username?: string | null;
  status: string;
  created_at?: string;
}

export interface AnalyticsDashboard {
  followers: number;
  reach: number;
  likes: number;
  comments: number;
  shares: number;
  engagement_rate: number;
  growth_rate: number;
  posts_count: number;
}

export interface AnalyticsSeriesPoint {
  captured_at: string;
  reach: number;
  engagements: number;
  engagement_rate: number;
}

export interface TopPostAnalytics {
  post_id: string;
  title: string;
  platform: Platform;
  reach: number;
  engagements: number;
  engagement_rate: number;
}

export interface AnalyticsOverview {
  metrics: AnalyticsDashboard;
  series: AnalyticsSeriesPoint[];
  top_posts: TopPostAnalytics[];
  platform_reach: Record<string, number>;
}

export interface CaptionResult {
  caption: string;
  cta: string;
  hashtags: string[];
  source: string;
}

export interface HashtagResult {
  hashtags: string[];
  source: string;
}

export interface AnalyzeResult {
  score: number;
  strengths: string[];
  suggestions: string[];
  source: string;
}

export interface BestTime {
  best_day: string | null;
  best_hour: number | null;
  formatted_time: string | null;
  confidence: number;
  sample_size: number;
  reason: string;
}

export interface CalendarItem {
  schedule_id: string;
  post_id: string;
  title: string;
  platform: Platform;
  status: string;
  schedule_time: string;
}
