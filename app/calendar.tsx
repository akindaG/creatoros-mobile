import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Badge, Card, H1, Muted, Screen } from '@/components/ui';
import { calendar } from '@/services/mobile';
import { colors, spacing } from '@/constants/theme';

export default function CalendarScreen() {
  const items = useQuery({ queryKey: ['calendar'], queryFn: () => calendar() });

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>Content Calendar</H1>
        <Muted>Your upcoming scheduled publishing queue.</Muted>
        {(items.data || []).map((item) => (
          <Card key={item.schedule_id} style={{ gap: 8 }}>
            <View style={styles.row}>
              <Text style={styles.title}>{item.title}</Text>
              <Badge text={item.status || 'scheduled'} />
            </View>
            <Muted>{item.platform.toUpperCase()} • {new Date(item.schedule_time).toLocaleString()}</Muted>
          </Card>
        ))}
        {!items.data?.length && <Card><Muted>No scheduled posts yet. Open Studio, manage a draft and choose a publishing time.</Muted></Card>}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  title: { color: colors.text, fontWeight: '800', fontSize: 16, flex: 1 },
});
