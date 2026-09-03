import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card, H1, Muted, Screen } from '@/components/ui';
import { deletePost, listPosts } from '@/services/posts';
import { apiMessage } from '@/services/api';
import { colors, spacing } from '@/constants/theme';

export default function StudioScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const posts = useQuery({ queryKey: ['posts'], queryFn: () => listPosts() });

  async function remove(id: string) {
    try {
      await deletePost(id);
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    } catch (error) {
      Alert.alert('Delete failed', apiMessage(error));
    }
  }

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>Content Studio</H1>
        <Muted>Draft, scheduled and published content in one mobile workspace.</Muted>
        {posts.data?.map((post) => (
          <Card key={post.id} style={{ gap: 10 }}>
            <View style={styles.row}>
              <Text style={styles.title}>{post.title}</Text>
              <Badge text={post.status} tone={post.status === 'published' ? 'green' : post.status === 'failed' ? 'red' : 'purple'} />
            </View>
            <Muted>{post.platform.toUpperCase()}</Muted>
            <Text style={styles.caption}>{post.caption || 'No caption yet.'}</Text>
            <View style={styles.actions}>
              <Button title="Manage" variant="ghost" onPress={() => router.push({ pathname: '/post/[id]', params: { id: post.id } })} />
              {post.status === 'draft' ? (
                <Button
                  variant="danger"
                  title="Delete"
                  onPress={() => Alert.alert('Delete draft?', 'This cannot be undone.', [
                    { text: 'Cancel' },
                    { text: 'Delete', style: 'destructive', onPress: () => remove(post.id) },
                  ])}
                />
              ) : null}
            </View>
          </Card>
        ))}
        {!posts.data?.length && <Card><Muted>No content yet. Use the Create tab to start a draft.</Muted></Card>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 100 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  actions: { flexDirection: 'row', gap: 10 },
  title: { color: colors.text, fontSize: 17, fontWeight: '800', flex: 1 },
  caption: { color: colors.text, lineHeight: 20 },
});
