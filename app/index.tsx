import { Redirect } from 'expo-router';
import { useAuthStore } from '@/store/auth';

export default function IndexScreen() {
  const { token, hydrated } = useAuthStore();
  if (!hydrated) return null;
  return <Redirect href={token ? '/(tabs)' : '/(auth)/login'} />;
}
