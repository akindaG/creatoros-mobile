import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { User } from '@/types';

const TOKEN_KEY = 'creatoros_access_token';

type AuthState = {
  token: string | null;
  user: User | null;
  hydrated: boolean;
  setSession: (token: string, user?: User | null) => Promise<void>;
  setUser: (user: User | null) => void;
  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  hydrated: false,
  setSession: async (token, user = null) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    set({ token, user });
  },
  setUser: (user) => set({ user }),
  hydrate: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    set({ token, hydrated: true });
  },
  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({ token: null, user: null });
  },
}));
