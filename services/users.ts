import { api } from './api';
import type { User } from '@/types';

export async function getProfile() {
  return (await api.get<User>('/api/v1/users/me')).data;
}

export async function updateProfile(data: { name?: string; bio?: string; profile_image?: string }) {
  return (await api.put<User>('/api/v1/users/me', data)).data;
}

export async function changePassword(current_password: string, new_password: string) {
  return (await api.put<{ message: string }>('/api/v1/users/me/password', { current_password, new_password })).data;
}
