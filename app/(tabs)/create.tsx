import { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button, Card, H1, Input, Muted, Screen } from '@/components/ui';
import { createPost } from '@/services/posts';
import { generateCaption, uploadMedia } from '@/services/mobile';
import { apiMessage } from '@/services/api';
import { colors, spacing } from '@/constants/theme';
import type { Platform } from '@/types';

export default function CreateScreen() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [media, setMedia] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const ai = useMutation({
    mutationFn: () => generateCaption({ topic: topic || title, description: caption, tone: 'engaging', platform }),
    onSuccess: (result) => {
      setCaption(`${result.caption}${result.cta ? `\n\n${result.cta}` : ''}${result.hashtags.length ? `\n\n${result.hashtags.join(' ')}` : ''}`);
    },
    onError: (error) => Alert.alert('AI failed', apiMessage(error)),
  });

  const save = useMutation({
    mutationFn: async () => {
      let mediaUrl: string | undefined;
      if (media) {
        const upload = await uploadMedia(media.uri, media.mimeType || 'image/jpeg', media.fileName || 'creatoros-upload.jpg');
        mediaUrl = upload.url;
      }
      return createPost({ title: title.trim(), caption, media_url: mediaUrl, platform, status: 'draft' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      setTitle('');
      setCaption('');
      setTopic('');
      setMedia(null);
      Alert.alert('Draft saved', 'Your content is now in CreatorOS Studio.');
    },
    onError: (error) => Alert.alert('Save failed', apiMessage(error)),
  });

  async function pickMedia() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow media library access to attach content.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images', 'videos'], quality: 0.9 });
    if (!result.canceled) setMedia(result.assets[0]);
  }

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>Create post</H1>
        <Muted>Build a post, attach media and use AI to improve the caption.</Muted>
        <Card style={{ gap: 12 }}>
          <Input placeholder="Post title" value={title} onChangeText={setTitle} />
          <Input placeholder="AI topic or content idea" value={topic} onChangeText={setTopic} />
          <Input placeholder="Caption" value={caption} onChangeText={setCaption} multiline style={styles.area} />
          <View style={styles.row}>
            <Button title="Instagram" variant={platform === 'instagram' ? 'primary' : 'ghost'} onPress={() => setPlatform('instagram')} />
            <Button title="Facebook" variant={platform === 'facebook' ? 'primary' : 'ghost'} onPress={() => setPlatform('facebook')} />
          </View>
          <Button title={media ? 'Change media' : 'Choose image / video'} variant="ghost" onPress={pickMedia} />
          {media?.type === 'image' ? <Image source={{ uri: media.uri }} style={styles.preview} /> : null}
          {media?.type === 'video' ? <Text style={styles.file}>Video selected: {media.fileName || 'media'}</Text> : null}
          <Button title="Generate with AI" variant="ghost" loading={ai.isPending} onPress={() => ai.mutate()} disabled={!topic.trim() && !title.trim()} />
          <Button title="Save draft" loading={save.isPending} onPress={() => save.mutate()} disabled={!title.trim()} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 100 },
  area: { minHeight: 140, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  preview: { height: 220, width: '100%', borderRadius: 14, backgroundColor: colors.panel2 },
  file: { color: colors.text },
});
