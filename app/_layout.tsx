import { useEffect } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import NotificationsModal from '@/components/NotificationsModal';
import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="(customer-tabs)" />
      <Stack.Screen name="(provider-tabs)" />
      <Stack.Screen name="professional-detail" />
      <Stack.Screen name="service-detail" />
      <Stack.Screen name="booking-calendar" />
      <Stack.Screen name="chat-detail" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="account-settings" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
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