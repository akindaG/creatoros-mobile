import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, H1, Input, Muted, Screen } from '@/components/ui';
import { login, me } from '@/services/auth';
import { apiMessage } from '@/services/api';
import { useAuthStore } from '@/store/auth';
import { colors } from '@/constants/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const setSession = useAuthStore((state) => state.setSession);

  async function submit() {
    try {
      setBusy(true);
      const session = await login(email.trim(), password);
      await setSession(session.access_token);
      useAuthStore.getState().setUser(await me());
    } catch (error) {
      Alert.alert('Login failed', apiMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.wrap} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.logo}><Text style={styles.mark}>C</Text></View>
        <H1>Welcome back</H1>
        <Muted>Sign in to manage content, analytics and AI growth insights.</Muted>
        <View style={styles.form}>
          <Input autoCapitalize="none" keyboardType="email-address" placeholder="Email address" value={email} onChangeText={setEmail} />
          <Input secureTextEntry placeholder="Password" value={password} onChangeText={setPassword} />
          <Button title="Sign in" onPress={submit} loading={busy} disabled={!email.trim() || !password} />
          <Link href="/(auth)/forgot-password" style={styles.link}>Forgot password?</Link>
          <Link href="/(auth)/register" style={styles.link}>Create an account</Link>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'center', gap: 12 },
  logo: { width: 52, height: 52, borderRadius: 16, backgroundColor: colors.purple, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  mark: { fontSize: 26, color: '#fff', fontWeight: '900' },
  form: { gap: 12, marginTop: 18 },
  link: { color: colors.purple2, textAlign: 'center', padding: 8, fontWeight: '700' },
});
