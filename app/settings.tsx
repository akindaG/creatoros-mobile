import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button, Card, H1, Input, Muted, Screen } from '@/components/ui';
import { uploadMedia } from '@/services/mobile';
import { apiMessage, absoluteMediaUrl } from '@/services/api';
import { changePassword, updateProfile } from '@/services/users';
import { useAuthStore } from '@/store/auth';
import { colors, spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState<string | undefined>();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setProfileImage(user?.profile_image || undefined);
  }, [user]);

  async function pickAvatar() {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) return Alert.alert('Permission required', 'Allow media access to select a profile image.');
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (result.canceled) return;
      const asset = result.assets[0];
      const upload = await uploadMedia(asset.uri, asset.mimeType || 'image/jpeg', asset.fileName || 'profile.jpg');
      setProfileImage(upload.url);
    } catch (error) {
      Alert.alert('Image upload failed', apiMessage(error));
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);
      const updated = await updateProfile({ name: name.trim(), bio, profile_image: profileImage || '' });
      setUser(updated);
      Alert.alert('Profile updated', 'Your CreatorOS profile has been saved.');
    } catch (error) {
      Alert.alert('Update failed', apiMessage(error));
    } finally {
      setSaving(false);
    }
  }

  async function updatePassword() {
    try {
      setChanging(true);
      const result = await changePassword(currentPassword, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      Alert.alert('Password updated', result.message);
    } catch (error) {
      Alert.alert('Password change failed', apiMessage(error));
    } finally {
      setChanging(false);
    }
  }

  return (
    <Screen style={{ padding: 0 }}>
      <ScrollView contentContainerStyle={styles.body}>
        <H1>Settings</H1>
        <Muted>Profile information, security and mobile app configuration.</Muted>

        <Card style={{ gap: 12 }}>
          <Text style={styles.label}>Profile</Text>
          {profileImage ? <Image source={{ uri: absoluteMediaUrl(profileImage) }} style={styles.avatar} /> : null}
          <Button title="Choose profile image" variant="ghost" onPress={pickAvatar} />
          <Input value={name} onChangeText={setName} placeholder="Name" />
          <Input value={user?.email || ''} editable={false} placeholder="Email" />
          <Input value={bio} onChangeText={setBio} multiline placeholder="Bio" style={styles.bio} />
          <Button title="Save profile" onPress={saveProfile} loading={saving} disabled={name.trim().length < 2} />
        </Card>

        <Card style={{ gap: 12 }}>
          <Text style={styles.label}>Change password</Text>
          <Input secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} placeholder="Current password" />
          <Input secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="New password, minimum 8 characters" />
          <Button title="Change password" onPress={updatePassword} loading={changing} disabled={currentPassword.length < 8 || newPassword.length < 8} />
        </Card>

        <Card style={{ gap: 8 }}>
          <Text style={styles.label}>Backend API</Text>
          <Muted>{process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000'}</Muted>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: spacing.md, gap: 14, paddingBottom: 40 },
  label: { color: colors.text, fontWeight: '800', fontSize: 16 },
  bio: { minHeight: 100, textAlignVertical: 'top' },
  avatar: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.panel2 },
});
