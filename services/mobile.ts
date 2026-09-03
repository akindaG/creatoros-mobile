import { api } from './api';
import type {
  AnalyticsDashboard,
  AnalyticsOverview,
  AnalyzeResult,
  BestTime,
  CalendarItem,
  CaptionResult,
  HashtagResult,
  Platform,
  SocialAccount,
} from '@/types';

export async function generateCaption(data: { topic: string; description?: string; tone?: string; platform?: Platform }) {
  return (await api.post<CaptionResult>('/api/v1/ai/caption', data)).data;
}

export async function generateHashtags(data: { topic: string; caption?: string; platform?: Platform }) {
  return (await api.post<HashtagResult>('/api/v1/ai/hashtags', data)).data;
}

export async function analyzeContent(data: { caption: string; platform?: Platform }) {
  return (await api.post<AnalyzeResult>('/api/v1/ai/analyze', data)).data;
}

export async function dashboard() {
  return (await api.get<AnalyticsDashboard>('/api/v1/analytics/dashboard')).data;
}

export async function analyticsOverview() {
  return (await api.get<AnalyticsOverview>('/api/v1/analytics/overview')).data;
}

export async function bestTime() {
  return (await api.get<BestTime>('/api/v1/recommendations/best-time')).data;
}

export async function growthRecommendations() {
  return (await api.post<{ recommendations: string[] }>('/api/v1/recommendations/growth')).data;
}

export async function socialAccounts() {
  return (await api.get<SocialAccount[]>('/api/v1/social-accounts')).data;
}

export async function connectAccount(data: {
  platform: Platform;
  account_name: string;
  username?: string;
  access_token: string;
  refresh_token?: string;
}) {
  return (await api.post<SocialAccount>('/api/v1/social-accounts', data)).data;
}

export async function disconnectAccount(id: string) {
  await api.delete(`/api/v1/social-accounts/${id}`);
}

export async function calendar(start?: string, end?: string) {
  return (await api.get<CalendarItem[]>('/api/v1/calendar', { params: { start, end } })).data;
}

export async function uploadMedia(uri: string, mimeType = 'image/jpeg', name = 'upload.jpg') {
  const form = new FormData();
  form.append('file', { uri, type: mimeType, name } as any);
  return (
    await api.post<{ message: string; url: string; storage: string; object_name: string }>('/api/v1/media/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  ).data;
}
