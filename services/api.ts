import axios from 'axios';
import { useAuthStore } from '@/store/auth';

const baseURL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  timeout: 30000,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401) {
      await useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  },
);

export const apiMessage = (error: unknown) => {
  const e = error as any;
  return e?.response?.data?.detail || e?.response?.data?.message || e?.message || 'Something went wrong';
};

export function absoluteMediaUrl(url?: string | null) {
  if (!url) return undefined;
  if (/^https?:\/\//i.test(url)) return url;
  return `${baseURL.replace(/\/$/, '')}/${url.replace(/^\//, '')}`;
}
