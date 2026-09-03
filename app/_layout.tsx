import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { me } from '@/services/auth';
import { useAuthStore } from '@/store/auth';

export default function RootLayout() {
  const queryClient = useMemo(() => new QueryClient({ defaultOptions: { queries: { retry: 1 } } }), []);
  const { token, hydrated, hydrate, setUser, logout } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    const inAuth = segments[0] === '(auth)';
    if (!token && !inAuth) router.replace('/(auth)/login');
    if (token && inAuth) router.replace('/(tabs)');
  }, [hydrated, router, segments, token]);

  useEffect(() => {
    if (!token) return;
    me().then(setUser).catch(() => logout());
  }, [logout, setUser, token]);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#090A12' } }} />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
