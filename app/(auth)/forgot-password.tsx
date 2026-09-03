import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, H1, Input, Muted, Screen } from '@/components/ui';
import { forgotPassword } from '@/services/auth';
import { apiMessage } from '@/services/api';
import { colors } from '@/constants/theme';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    try {
      setBusy(true);
      const result = await forgotPassword(email.trim());
      Alert.alert('Password reset', result.message);
    } catch (error) {
      Alert.alert('Request failed', apiMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen style={styles.wrap}>
      <H1>Reset password</H1>
      <Muted>Request a password reset through the CreatorOS API.</Muted>
      <View style={styles.form}>
        <Input autoCapitalize="none" keyboardType="email-address" placeholder="Email address" value={email} onChangeText={setEmail} />
        <Button title="Request reset" onPress={submit} loading={busy} disabled={!email.trim()} />
        <Link href="/(auth)/login" style={styles.link}>Back to sign in</Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({ wrap: { justifyContent: 'center' }, form: { gap: 12, marginTop: 18 }, link: { color: colors.purple2, textAlign: 'center', padding: 10, fontWeight: '700' } });
