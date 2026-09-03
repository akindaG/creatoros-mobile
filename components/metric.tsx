import { StyleSheet, Text } from 'react-native';
import { Card, Muted } from '@/components/ui';
import { colors } from '@/constants/theme';

export function Metric({ label, value, delta }: { label: string; value: string; delta?: string }) {
  return (
    <Card style={styles.card}>
      <Muted>{label}</Muted>
      <Text style={styles.value}>{value}</Text>
      {delta ? <Text style={styles.delta}>{delta}</Text> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: '48%', gap: 5 },
  value: { color: colors.text, fontSize: 24, fontWeight: '900' },
  delta: { color: colors.green, fontSize: 12, fontWeight: '700' },
});
