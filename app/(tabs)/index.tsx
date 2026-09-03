import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Badge, Card, H1, H2, Muted, Screen } from '@/components/ui';
import { Metric } from '@/components/metric';
import { bestTime, dashboard } from '@/services/mobile';
import { listPosts } from '@/services/posts';
import { useAuthStore } from '@/store/auth';
import { colors, spacing } from '@/constants/theme';

const number = (value?: number) => (typeof value === 'number' ? value.toLocaleString() : '0');

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);
  const metrics = useQuery({ queryKey: ['dashboard'], queryFn: dashboard });
  const posts = useQuery({ queryKey: ['posts', 'recent'], queryFn: () => listPosts() });
  const best = useQuery({ queryKey: ['best-time'], queryFn: bestTime });

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView
        contentContainerStyle={styles.body}
        refreshControl={
          <RefreshControl
            tintColor={colors.purple2}
            refreshing={metrics.isFetching || posts.isFetching}
            onRefresh={() => {
              metrics.refetch();
              posts.refetch();
              best.refetch();
            }}
          />
        }
      >
        <View>
          <H1>Hello{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</H1>
          <Muted>Your social growth command center.</Muted>
        </View>

        <View style={styles.grid}>
          <Metric label="Reach" value={number(metrics.data?.reach)} />
          <Metric label="Engagement" value={`${metrics.data?.engagement_rate ?? 0}%`} />
          <Metric label="Likes" value={number(metrics.data?.likes)} />
          <Metric label="Comments" value={number(metrics.data?.comments)} />
        </View>

        <Card style={{ gap: 10 }}>
          <View style={styles.row}>
            <H2>AI posting window</H2>
            <Badge text="Recommended" tone="green" />
          </View>
          <Text style={styles.big}>
            {best.data?.best_day || 'Collecting data'} {best.data?.formatted_time ? `• ${best.data.formatted_time}` : ''}
          </Text>
          <Muted>{best.data?.reason || 'CreatorOS needs engagement history before it can recommend a stronger posting window.'}</Muted>
        </Card>

        <H2>Recent posts</H2>
        {(posts.data || []).slice(0, 4).map((post) => (
          <Card key={post.id} style={{ gap: 8 }}>
            <View style={styles.row}>
              <Text style={styles.title}>{post.title}</Text>
              <Badge text={post.status} tone={post.status === 'published' ? 'green' : post.status === 'failed' ? 'red' : 'purple'} />
            </View>
            <Muted>{post.platform.toUpperCase()} • {post.caption?.slice(0, 85) || 'No caption yet'}</Muted>
          </Card>
        ))}
        {!posts.data?.length && <Card><Muted>No posts yet. Open Create to make your first draft.</Muted></Card>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 16, paddingBottom: 100 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  big: { fontSize: 22, color: colors.text, fontWeight: '900' },
  title: { color: colors.text, fontWeight: '800', flex: 1 },
});
