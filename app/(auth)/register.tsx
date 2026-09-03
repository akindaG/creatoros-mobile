import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Button, H1, Input, Muted, Screen } from '@/components/ui';
import { register } from '@/services/auth';
import { apiMessage } from '@/services/api';
import { colors } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit() {
    try {
      setBusy(true);
      await register(name.trim(), email.trim(), password);
      Alert.alert('Account created', 'You can now sign in.');
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Could not register', apiMessage(error));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Screen style={styles.wrap}>
      <H1>Create your account</H1>
      <Muted>Start managing your CreatorOS workspace from mobile.</Muted>
      <View style={styles.form}>
        <Input placeholder="Full name" value={name} onChangeText={setName} />
        <Input autoCapitalize="none" keyboardType="email-address" placeholder="Email address" value={email} onChangeText={setEmail} />
        <Input secureTextEntry placeholder="Password, minimum 8 characters" value={password} onChangeText={setPassword} />
        <Button title="Create account" onPress={submit} loading={busy} disabled={name.trim().length < 2 || !email.trim() || password.length < 8} />
        <Link href="/(auth)/login" style={styles.link}>Already have an account? Sign in</Link>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { justifyContent: 'center' },
  form: { gap: 12, marginTop: 18 },
  link: { color: colors.purple2, textAlign: 'center', padding: 10, fontWeight: '700' },
});
