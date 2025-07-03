
import { Stack } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ProtectedLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/');
    }
  }, [user, loading]);

  if (loading) {
    return null;
  }

  if (!user) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="users/index" />
      <Stack.Screen name="users/[id]" />
      <Stack.Screen name="users/create" />
      <Stack.Screen name="users/edit/[id]" />
    </Stack>
  );
}
