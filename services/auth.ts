import { api } from './api';
import type { User } from '@/types';

export async function register(name: string, email: string, password: string) {
  return (await api.post<User>('/api/v1/auth/register', { name, email, password })).data;
}

export async function login(email: string, password: string) {
  return (await api.post<{ access_token: string; token_type: string }>('/api/v1/auth/login', { email, password })).data;
}

export async function me() {
  return (await api.get<User>('/api/v1/auth/me')).data;
}

export async function forgotPassword(email: string) {
  return (await api.post<{ message: string; reset_token?: string }>('/api/v1/auth/forgot-password', { email })).data;
}

export async function resetPassword(token: string, new_password: string) {
  return (await api.post<{ message: string }>('/api/v1/auth/reset-password', { token, new_password })).data;
}

export async function logoutApi() {
  await api.post('/api/v1/auth/logout');
}
