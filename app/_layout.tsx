import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationsModal from '@/components/NotificationsModal';
import { router, Slot } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        if (user.type === 'customer') {
          router.replace('/(customer-tabs)');
        } else if (user.type === 'provider') {
          router.replace('/(provider-tabs)');
        } else {
          // Fallback for unknown user types or initial load
          router.replace('/');
        }
      } else {
        // User is not logged in
        const currentPath = router.pathname;
        if (currentPath && !currentPath.startsWith('/auth')) {
          router.replace('/auth/login');
        }
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <NotificationProvider>
      <AuthProvider>
        <RootLayoutNav />
        <NotificationsModal />
      </AuthProvider>
    </NotificationProvider>
  );
}