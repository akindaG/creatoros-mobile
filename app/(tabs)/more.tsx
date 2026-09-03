import { Alert, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Card, H1, Muted, Screen } from '@/components/ui';
import { logoutApi } from '@/services/auth';
import { useAuthStore } from '@/store/auth';
import { colors, spacing } from '@/constants/theme';

const items = [
  ['calendar-outline', 'Calendar', '/calendar'],
  ['sparkles-outline', 'AI Assistant', '/ai'],
  ['people-outline', 'Social Accounts', '/accounts'],
  ['settings-outline', 'Settings', '/settings'],
] as const;

export default function MoreScreen() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  async function signOut() {
    try { await logoutApi(); } catch {}
    await logout();
  }

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>More</H1>
        <Muted>Scheduling, AI tools, integrations and account controls.</Muted>
        {items.map(([icon, label, path]) => (
          <Pressable key={label} onPress={() => router.push(path)}>
            <Card style={styles.item}>
              <Ionicons name={icon} size={23} color={colors.purple2} />
              <Text style={styles.label}>{label}</Text>
              <Ionicons name="chevron-forward" size={19} color={colors.muted} />
            </Card>
          </Pressable>
        ))}
        <Pressable onPress={() => Alert.alert('Sign out?', 'You will need to sign in again on this device.', [
          { text: 'Cancel' },
          { text: 'Sign out', style: 'destructive', onPress: signOut },
        ])}>
          <Card style={styles.item}>
            <Ionicons name="log-out-outline" size={23} color={colors.red} />
            <Text style={styles.label}>Sign out</Text>
          </Card>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 12, paddingBottom: 100 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  label: { color: colors.text, fontWeight: '800', fontSize: 16, flex: 1 },
});
