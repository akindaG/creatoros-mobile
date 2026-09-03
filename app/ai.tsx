import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button, Card, H1, H2, Input, Muted, Screen } from '@/components/ui';
import { analyzeContent, generateCaption, generateHashtags } from '@/services/mobile';
import { apiMessage } from '@/services/api';
import { colors, spacing } from '@/constants/theme';
import type { AnalyzeResult, CaptionResult, HashtagResult, Platform } from '@/types';

export default function AIAssistantScreen() {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [busy, setBusy] = useState<string | null>(null);
  const [caption, setCaption] = useState<CaptionResult | null>(null);
  const [hashtags, setHashtags] = useState<HashtagResult | null>(null);
  const [analysis, setAnalysis] = useState<AnalyzeResult | null>(null);

  async function run(type: 'caption' | 'hashtags' | 'analyze') {
    try {
      setBusy(type);
      if (type === 'caption') setCaption(await generateCaption({ topic: input, tone: 'engaging', platform }));
      if (type === 'hashtags') setHashtags(await generateHashtags({ topic: input, platform }));
      if (type === 'analyze') setAnalysis(await analyzeContent({ caption: input, platform }));
    } catch (error) {
      Alert.alert('AI request failed', apiMessage(error));
    } finally {
      setBusy(null);
    }
  }

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>AI Assistant</H1>
        <Muted>Generate captions, hashtags and content quality feedback using the backend Ollama + Qwen service.</Muted>
        <Card style={{ gap: 12 }}>
          <View style={styles.row}>
            <Button title="Instagram" variant={platform === 'instagram' ? 'primary' : 'ghost'} onPress={() => setPlatform('instagram')} />
            <Button title="Facebook" variant={platform === 'facebook' ? 'primary' : 'ghost'} onPress={() => setPlatform('facebook')} />
          </View>
          <Input multiline placeholder="Describe your post idea or paste a caption..." value={input} onChangeText={setInput} style={styles.area} />
          <Button title="Generate caption" loading={busy === 'caption'} onPress={() => run('caption')} disabled={!input.trim()} />
          <Button title="Generate hashtags" variant="ghost" loading={busy === 'hashtags'} onPress={() => run('hashtags')} disabled={!input.trim()} />
          <Button title="Analyze content" variant="ghost" loading={busy === 'analyze'} onPress={() => run('analyze')} disabled={!input.trim()} />
        </Card>

        {caption && <Card style={{ gap: 10 }}><H2>Caption</H2><Text style={styles.output}>{caption.caption}</Text><Text style={styles.cta}>{caption.cta}</Text><Muted>{caption.hashtags.join(' ')}</Muted></Card>}
        {hashtags && <Card style={{ gap: 10 }}><H2>Hashtags</H2><Text style={styles.tags}>{hashtags.hashtags.join(' ')}</Text></Card>}
        {analysis && <Card style={{ gap: 10 }}><H2>Content score</H2><Text style={styles.score}>{analysis.score}/100</Text><H2>Strengths</H2>{analysis.strengths.map((item) => <Text key={item} style={styles.output}>• {item}</Text>)}<H2>Suggestions</H2>{analysis.suggestions.map((item) => <Text key={item} style={styles.output}>• {item}</Text>)}</Card>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 40 },
  area: { minHeight: 140, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: 10 },
  output: { color: colors.text, lineHeight: 21 },
  cta: { color: colors.purple2, fontWeight: '800' },
  tags: { color: colors.purple2, lineHeight: 22 },
  score: { color: colors.green, fontSize: 34, fontWeight: '900' },
});
