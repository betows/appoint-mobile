import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Shield, Eye, Trash2, Download } from 'lucide-react-native';
import { router } from 'expo-router';

export default function AccountSettings() {
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: true,
    marketing: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showPhone: false,
    showEmail: true,
    allowMessages: true,
  });

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir Conta',
      'Esta ação é irreversível. Todos os seus dados serão permanentemente removidos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Conta Excluída', 'Sua conta foi excluída com sucesso.');
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Exportar Dados',
      'Seus dados serão enviados por email em até 24 horas.',
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações da Conta</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Notificações</Text>
          </View>
          
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notificações Push</Text>
                <Text style={styles.settingSubtitle}>Receber alertas no dispositivo</Text>
              </View>
              <Switch
                value={notifications.push}
                onValueChange={(value) => handleNotificationChange('push', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Email</Text>
                <Text style={styles.settingSubtitle}>Receber notificações por email</Text>
              </View>
              <Switch
                value={notifications.email}
                onValueChange={(value) => handleNotificationChange('email', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>SMS</Text>
                <Text style={styles.settingSubtitle}>Receber alertas por SMS</Text>
              </View>
              <Switch
                value={notifications.sms}
                onValueChange={(value) => handleNotificationChange('sms', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Marketing</Text>
                <Text style={styles.settingSubtitle}>Ofertas e promoções</Text>
              </View>
              <Switch
                value={notifications.marketing}
                onValueChange={(value) => handleNotificationChange('marketing', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Privacy */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Shield size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Privacidade</Text>
          </View>
          
          <View style={styles.settingsGroup}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Perfil Visível</Text>
                <Text style={styles.settingSubtitle}>Permitir que outros vejam seu perfil</Text>
              </View>
              <Switch
                value={privacy.profileVisible}
                onValueChange={(value) => handlePrivacyChange('profileVisible', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Mostrar Telefone</Text>
                <Text style={styles.settingSubtitle}>Exibir telefone no perfil público</Text>
              </View>
              <Switch
                value={privacy.showPhone}
                onValueChange={(value) => handlePrivacyChange('showPhone', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Mostrar Email</Text>
                <Text style={styles.settingSubtitle}>Exibir email no perfil público</Text>
              </View>
              <Switch
                value={privacy.showEmail}
                onValueChange={(value) => handlePrivacyChange('showEmail', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Permitir Mensagens</Text>
                <Text style={styles.settingSubtitle}>Receber mensagens de clientes</Text>
              </View>
              <Switch
                value={privacy.allowMessages}
                onValueChange={(value) => handlePrivacyChange('allowMessages', value)}
                trackColor={{ false: '#E5E7EB', true: '#10B981' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Eye size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Gerenciamento de Dados</Text>
          </View>
          
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.actionItem} onPress={handleExportData}>
              <Download size={20} color="#3B82F6" />
              <View style={styles.actionInfo}>
                <Text style={styles.actionTitle}>Exportar Dados</Text>
                <Text style={styles.actionSubtitle}>Baixar uma cópia dos seus dados</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Trash2 size={20} color="#EF4444" />
            <Text style={[styles.sectionTitle, { color: '#EF4444' }]}>Zona de Perigo</Text>
          </View>
          
          <View style={styles.settingsGroup}>
            <TouchableOpacity style={styles.dangerItem} onPress={handleDeleteAccount}>
              <Trash2 size={20} color="#EF4444" />
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: '#EF4444' }]}>Excluir Conta</Text>
                <Text style={styles.actionSubtitle}>Remover permanentemente sua conta</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  settingsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  dangerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FEF2F2',
    gap: 12,
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});