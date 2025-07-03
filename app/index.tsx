import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';

export default function StartPage() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.type === 'customer') {
          router.replace('/(customer-tabs)');
        } else if (user.type === 'provider') {
          router.replace('/(provider-tabs)');
        }
      } else {
        router.replace('/auth');
      }
    }
  }, [user, isLoading]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#10B981" />
    </View>
  );
}