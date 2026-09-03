import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Card, H1, H2, Muted, Screen } from '@/components/ui';
import { Metric } from '@/components/metric';
import { analyticsOverview, bestTime } from '@/services/mobile';
import { colors, spacing } from '@/constants/theme';

export default function AnalyticsScreen() {
  const overview = useQuery({ queryKey: ['analytics-overview'], queryFn: analyticsOverview });
  const best = useQuery({ queryKey: ['best-time'], queryFn: bestTime });
  const metrics = overview.data?.metrics;
  const values = [metrics?.reach || 0, metrics?.likes || 0, metrics?.comments || 0, metrics?.shares || 0];
  const max = Math.max(...values, 1);

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>Analytics</H1>
        <Muted>Performance signals and data-driven growth guidance.</Muted>
        <View style={styles.grid}>
          <Metric label="Reach" value={(metrics?.reach ?? 0).toLocaleString()} />
          <Metric label="Engagement" value={`${metrics?.engagement_rate ?? 0}%`} />
          <Metric label="Likes" value={(metrics?.likes ?? 0).toLocaleString()} />
          <Metric label="Shares" value={(metrics?.shares ?? 0).toLocaleString()} />
        </View>

        <Card style={{ gap: 14 }}>
          <H2>Performance overview</H2>
          {['Reach', 'Likes', 'Comments', 'Shares'].map((label, index) => (
            <View key={label} style={{ gap: 6 }}>
              <View style={styles.row}><Muted>{label}</Muted><Text style={styles.num}>{values[index].toLocaleString()}</Text></View>
              <View style={styles.track}><View style={[styles.bar, { width: `${Math.max(4, (values[index] / max) * 100)}%` }]} /></View>
            </View>
          ))}
        </Card>

        <Card style={{ gap: 8 }}>
          <H2>Best posting time</H2>
          <Text style={styles.best}>{best.data?.best_day || 'Not enough data'} {best.data?.formatted_time ? `at ${best.data.formatted_time}` : ''}</Text>
          <Muted>{best.data?.reason || 'CreatorOS needs engagement history before it can recommend a strong posting window.'}</Muted>
        </Card>

        <Card style={{ gap: 10 }}>
          <H2>Top posts</H2>
          {(overview.data?.top_posts || []).slice(0, 5).map((post) => (
            <View key={post.post_id} style={styles.topPost}>
              <View style={{ flex: 1 }}><Text style={styles.topTitle}>{post.title}</Text><Muted>{post.platform.toUpperCase()}</Muted></View>
              <Text style={styles.num}>{post.engagement_rate}%</Text>
            </View>
          ))}
          {!overview.data?.top_posts.length && <Muted>No post analytics available yet.</Muted>}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  num: { color: colors.text, fontWeight: '700' },
  track: { height: 9, borderRadius: 99, backgroundColor: colors.panel2, overflow: 'hidden' },
  bar: { height: '100%', backgroundColor: colors.purple, borderRadius: 99 },
  best: { color: colors.text, fontSize: 21, fontWeight: '900' },
  topPost: { flexDirection: 'row', alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, paddingTop: 10, gap: 12 },
  topTitle: { color: colors.text, fontWeight: '800' },
});
