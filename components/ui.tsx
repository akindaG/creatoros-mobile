import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing } from '@/constants/theme';

export function Screen({ children, style, ...props }: ViewProps) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.screen, style]} {...props}>
      {children}
    </SafeAreaView>
  );
}

export function Card({ children, style, ...props }: ViewProps) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

export const H1 = ({ children }: { children: React.ReactNode }) => <Text style={styles.h1}>{children}</Text>;
export const H2 = ({ children }: { children: React.ReactNode }) => <Text style={styles.h2}>{children}</Text>;
export const Muted = ({ children }: { children: React.ReactNode }) => <Text style={styles.muted}>{children}</Text>;

export function Input(props: TextInputProps) {
  return <TextInput placeholderTextColor={colors.muted} style={[styles.input, props.style]} {...props} />;
}

export function Button({
  title,
  onPress,
  loading,
  variant = 'primary',
  disabled,
}: {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  disabled?: boolean;
}) {
  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        variant === 'ghost' && styles.ghost,
        variant === 'danger' && styles.danger,
        (disabled || loading) && { opacity: 0.55 },
      ]}
    >
      {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.buttonText}>{title}</Text>}
    </Pressable>
  );
}

export function Badge({ text, tone = 'purple' }: { text: string; tone?: 'purple' | 'green' | 'red' | 'amber' }) {
  const backgroundColor =
    tone === 'green' ? '#173D34' : tone === 'red' ? '#4B2229' : tone === 'amber' ? '#49371C' : '#2B2145';
  const color = tone === 'green' ? colors.green : tone === 'red' ? colors.red : tone === 'amber' ? colors.amber : colors.purple2;
  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={{ color, fontWeight: '700', fontSize: 12 }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg, padding: spacing.md },
  card: {
    backgroundColor: colors.panel,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  h1: { color: colors.text, fontSize: 28, fontWeight: '800' },
  h2: { color: colors.text, fontSize: 18, fontWeight: '700' },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  input: {
    backgroundColor: colors.panel2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.sm,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 15,
  },
  button: {
    backgroundColor: colors.purple,
    borderRadius: radius.sm,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  ghost: { backgroundColor: colors.panel2, borderWidth: 1, borderColor: colors.border },
  danger: { backgroundColor: '#B83F50' },
  buttonText: { color: colors.white, fontWeight: '800', fontSize: 15 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 5, borderRadius: radius.pill },
});
