import { api } from './api';
import type { Platform, Post, PostStatus } from '@/types';

export async function listPosts(params?: { platform?: Platform; status?: PostStatus }) {
  return (await api.get<Post[]>('/api/v1/posts', { params })).data;
}

export async function getPost(id: string) {
  return (await api.get<Post>(`/api/v1/posts/${id}`)).data;
}

export async function createPost(data: {
  title: string;
  caption?: string;
  media_url?: string;
  platform: Platform;
  status?: PostStatus;
  scheduled_time?: string;
}) {
  return (await api.post<Post>('/api/v1/posts', { status: 'draft', ...data })).data;
}

export async function updatePost(id: string, data: Partial<Pick<Post, 'title' | 'caption' | 'media_url' | 'platform' | 'status' | 'scheduled_time'>>) {
  return (await api.put<Post>(`/api/v1/posts/${id}`, data)).data;
}

export async function deletePost(id: string) {
  await api.delete(`/api/v1/posts/${id}`);
}

export async function schedulePost(postId: string, schedule_time: string, platform: Platform) {
  return (await api.post(`/api/v1/posts/${postId}/schedule`, { schedule_time, platform })).data;
}

export async function cancelSchedule(postId: string) {
  return (await api.delete(`/api/v1/posts/${postId}/schedule`)).data;
}

export async function publishPost(postId: string) {
  return (await api.post(`/api/v1/publishing/posts/${postId}`)).data;
}
