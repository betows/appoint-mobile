import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CreditCard as Edit, Star, MapPin, Phone, Mail, Settings, LogOut } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockUsers } from '@/data/mockData';

export default function CustomerProfile() {
  const customer = mockUsers.find(user => user.type === 'customer');

  const handleLogout = () => {
    router.replace('/auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: customer?.avatar }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.customerName}>{customer?.name}</Text>
          <Text style={styles.customerEmail}>{customer?.email}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Contato</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Mail size={20} color="#6B7280" />
              <Text style={styles.infoText}>{customer?.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Phone size={20} color="#6B7280" />
              <Text style={styles.infoText}>{customer?.phone}</Text>
            </View>
            <View style={styles.infoItem}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.infoText}>São Paulo, SP</Text>
            </View>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Estatísticas</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Serviços Contratados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>4.9</Text>
              <Text style={styles.statLabel}>Avaliação Média</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>R$ 1.240</Text>
              <Text style={styles.statLabel}>Total Investido</Text>
            </View>
          </View>
        </View>

        {/* Favorite Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias Favoritas</Text>
          
          <View style={styles.categoriesContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>🧹 Faxina</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>⚡ Eletricista</Text>
            </View>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>🔧 Encanador</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <View style={styles.settingsContainer}>
            <TouchableOpacity style={styles.settingItem}>
              <Settings size={20} color="#6B7280" />
              <Text style={styles.settingText}>Configurações da Conta</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem}>
              <Edit size={20} color="#6B7280" />
              <Text style={styles.settingText}>Editar Perfil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={[styles.settingText, styles.logoutText]}>Sair da Conta</Text>
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
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    backgroundColor: '#F9FAFB',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#10B981',
    borderRadius: 16,
    padding: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  customerName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  categoryTagText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  settingsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  logoutText: {
    color: '#EF4444',
  },
});