import { useEffect, useState } from 'react';
import { Alert, Platform as RNPlatform, ScrollView, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card, H1, Input, Muted, Screen } from '@/components/ui';
import { apiMessage } from '@/services/api';
import { cancelSchedule, getPost, publishPost, schedulePost, updatePost } from '@/services/posts';
import { socialAccounts } from '@/services/mobile';
import { colors, spacing } from '@/constants/theme';
import type { Platform } from '@/types';

export default function PostDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const queryClient = useQueryClient();
  const post = useQuery({ queryKey: ['post', id], queryFn: () => getPost(id!), enabled: Boolean(id) });
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: socialAccounts });
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [scheduleAt, setScheduleAt] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!post.data) return;
    setTitle(post.data.title);
    setCaption(post.data.caption || '');
    setPlatform(post.data.platform);
    if (post.data.scheduled_time) setScheduleAt(new Date(post.data.scheduled_time));
  }, [post.data]);

  async function save() {
    try {
      setBusy('save');
      await updatePost(id!, { title: title.trim(), caption, platform });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await post.refetch();
      Alert.alert('Saved', 'Post changes have been saved.');
    } catch (error) {
      Alert.alert('Save failed', apiMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function schedule() {
    try {
      setBusy('schedule');
      await schedulePost(id!, scheduleAt.toISOString(), platform);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['posts'] }),
        queryClient.invalidateQueries({ queryKey: ['calendar'] }),
      ]);
      await post.refetch();
      Alert.alert('Scheduled', `Post scheduled for ${scheduleAt.toLocaleString()}.`);
    } catch (error) {
      Alert.alert('Scheduling failed', apiMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function cancel() {
    try {
      setBusy('cancel');
      await cancelSchedule(id!);
      await queryClient.invalidateQueries({ queryKey: ['calendar'] });
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await post.refetch();
    } catch (error) {
      Alert.alert('Could not cancel schedule', apiMessage(error));
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    try {
      setBusy('publish');
      await publishPost(id!);
      await queryClient.invalidateQueries({ queryKey: ['posts'] });
      await post.refetch();
      Alert.alert('Published', 'The backend accepted the publish request.');
    } catch (error) {
      Alert.alert('Publish failed', apiMessage(error));
    } finally {
      setBusy(null);
    }
  }

  function openAndroidPicker() {
    DateTimePickerAndroid.open({
      value: scheduleAt,
      mode: 'date',
      minimumDate: new Date(),
      onChange: (_, selectedDate) => {
        if (!selectedDate) return;
        const next = new Date(scheduleAt);
        next.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        DateTimePickerAndroid.open({
          value: next,
          mode: 'time',
          onChange: (_event, selectedTime) => {
            if (!selectedTime) return;
            next.setHours(selectedTime.getHours(), selectedTime.getMinutes(), 0, 0);
            setScheduleAt(next);
          },
        });
      },
    });
  }

  if (!post.data) {
    return <Screen><H1>Post</H1><Muted>{post.isLoading ? 'Loading post...' : 'Post not found.'}</Muted></Screen>;
  }

  const connected = accounts.data?.some((account) => account.platform === platform && account.status === 'connected');

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.header}><H1>Manage post</H1><Button title="Back" variant="ghost" onPress={() => router.back()} /></View>
        <View style={styles.header}><Muted>{post.data.platform.toUpperCase()}</Muted><Badge text={post.data.status} tone={post.data.status === 'published' ? 'green' : post.data.status === 'failed' ? 'red' : 'purple'} /></View>

        <Card style={{ gap: 12 }}>
          <Input value={title} onChangeText={setTitle} placeholder="Title" />
          <Input value={caption} onChangeText={setCaption} placeholder="Caption" multiline style={styles.area} />
          <View style={styles.row}>
            <Button title="Instagram" variant={platform === 'instagram' ? 'primary' : 'ghost'} onPress={() => setPlatform('instagram')} />
            <Button title="Facebook" variant={platform === 'facebook' ? 'primary' : 'ghost'} onPress={() => setPlatform('facebook')} />
          </View>
          <Button title="Save changes" onPress={save} loading={busy === 'save'} disabled={!title.trim()} />
        </Card>

        <Card style={{ gap: 12 }}>
          <Text style={styles.title}>Schedule publishing</Text>
          <Muted>{connected ? `${platform} is connected.` : `${platform} is not connected. Connect it before scheduling.`}</Muted>
          <Text style={styles.date}>{scheduleAt.toLocaleString()}</Text>
          {RNPlatform.OS === 'ios' ? (
            <DateTimePicker value={scheduleAt} mode="datetime" minimumDate={new Date()} onChange={(_, date) => date && setScheduleAt(date)} />
          ) : (
            <Button title="Choose date and time" variant="ghost" onPress={openAndroidPicker} />
          )}
          <Button title="Schedule post" onPress={schedule} loading={busy === 'schedule'} disabled={!connected || scheduleAt <= new Date()} />
          {post.data.status === 'scheduled' ? <Button title="Cancel schedule" variant="danger" onPress={cancel} loading={busy === 'cancel'} /> : null}
        </Card>

        <Card style={{ gap: 10 }}>
          <Text style={styles.title}>Publish now</Text>
          <Muted>This calls the backend publishing service. In simulation mode it performs the safe demo publishing flow. In live mode it uses the configured Meta Graph integration.</Muted>
          <Button title="Publish now" onPress={publish} loading={busy === 'publish'} disabled={!connected || post.data.status === 'published'} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  area: { minHeight: 140, textAlignVertical: 'top' },
  title: { color: colors.text, fontWeight: '800', fontSize: 16 },
  date: { color: colors.purple2, fontWeight: '900', fontSize: 18 },
});
