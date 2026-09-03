import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Badge, Button, Card, H1, Input, Muted, Screen } from '@/components/ui';
import { connectAccount, disconnectAccount, socialAccounts } from '@/services/mobile';
import { apiMessage } from '@/services/api';
import { colors, spacing } from '@/constants/theme';
import type { Platform } from '@/types';

export default function AccountsScreen() {
  const queryClient = useQueryClient();
  const accounts = useQuery({ queryKey: ['accounts'], queryFn: socialAccounts });
  const [platform, setPlatform] = useState<Platform>('instagram');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [busy, setBusy] = useState(false);

  async function connect() {
    try {
      setBusy(true);
      await connectAccount({ platform, account_name: name.trim(), username: username.trim() || undefined, access_token: token.trim() });
      setName('');
      setUsername('');
      setToken('');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (error) {
      Alert.alert('Connection failed', apiMessage(error));
    } finally {
      setBusy(false);
    }
  }

  async function disconnect(id: string) {
    try {
      await disconnectAccount(id);
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    } catch (error) {
      Alert.alert('Disconnect failed', apiMessage(error));
    }
  }

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>Social Accounts</H1>
        <Muted>The current backend uses token-based Facebook and Instagram connections. Tokens are encrypted server-side before storage.</Muted>

        {accounts.data?.map((account) => (
          <Card key={account.id} style={{ gap: 10 }}>
            <View style={styles.row}>
              <Text style={styles.title}>{account.account_name}</Text>
              <Badge text={account.platform} tone="green" />
            </View>
            <Muted>{account.username ? `@${account.username} • ` : ''}Status: {account.status}</Muted>
            <Button
              variant="danger"
              title="Disconnect"
              onPress={() => Alert.alert('Disconnect account?', 'Scheduled publishing for this platform may stop working.', [
                { text: 'Cancel' },
                { text: 'Disconnect', style: 'destructive', onPress: () => disconnect(account.id) },
              ])}
            />
          </Card>
        ))}

        <Card style={{ gap: 12 }}>
          <Text style={styles.title}>Connect account</Text>
          <View style={styles.row}>
            <Button title="Instagram" variant={platform === 'instagram' ? 'primary' : 'ghost'} onPress={() => setPlatform('instagram')} />
            <Button title="Facebook" variant={platform === 'facebook' ? 'primary' : 'ghost'} onPress={() => setPlatform('facebook')} />
          </View>
          <Input placeholder="Account or page name" value={name} onChangeText={setName} />
          <Input placeholder="Username, optional" value={username} onChangeText={setUsername} autoCapitalize="none" />
          <Input placeholder="Meta access token" value={token} onChangeText={setToken} secureTextEntry autoCapitalize="none" />
          <Button title="Connect" onPress={connect} loading={busy} disabled={!name.trim() || !token.trim()} />
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 40 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  title: { color: colors.text, fontWeight: '800', fontSize: 16, flex: 1 },
});
