import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit, Phone, Mail, Settings, LogOut, X, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth, User } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

interface ProviderDashboard {
  earnings: number;
  appointmentsCount: number;
  averageRating: number;
  workingHours: Array<{
    day: string;
    status: string;
    start?: string;
    break?: string;
    restart?: string;
    end?: string;
  }>;
}

export default function ProviderProfile() {
  const { user, logout } = useAuth();
  const [provider, setProvider] = useState<User | null>(user);
  const [dashboard, setDashboard] = useState<ProviderDashboard | null>(null);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    image: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    address: {
      street: '',
      number: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: '',
    },
  });

  useEffect(() => {
    if (user) {
      fetchProviderData();
    }
  }, [user]);

  const fetchProviderData = async () => {
    setLoading(true);
    try {
      const [profileResponse, dashboardResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/user`, {
          headers: { 'Authorization': `Bearer ${user?.token}` },
        }),
        fetch(`${API_BASE_URL}/user/provider/dashboard`, {
          headers: { 'Authorization': `Bearer ${user?.token}` },
        }),
      ]);

      const profileData = await profileResponse.json();
      const dashboardData = await dashboardResponse.json();

      if (!profileResponse.ok) {
        throw new Error(profileData.message || 'Failed to fetch profile');
      }
      if (!dashboardResponse.ok) {
        throw new Error(dashboardData.message || 'Failed to fetch dashboard');
      }

      setProvider(profileData);
      setDashboard(dashboardData);
      setForm({
        firstName: profileData.name.split(' ')[0] || '',
        lastName: profileData.name.split(' ').slice(1).join(' ') || '',
        email: profileData.email || '',
        phoneNumber: profileData.phone || '',
        image: profileData.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        address: profileData.address || { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
      });
    } catch (error) {
      console.error('Error fetching provider data:', error);
      Alert.alert("Erro", `Falha ao carregar dados: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/auth');
  };

  const openEditModal = () => {
    setEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setShowPasswordFields(false);
    fetchProviderData(); // Refresh data on modal close
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  const handleChange = (field: string, value: string, isAddressField = false) => {
    if (isAddressField) {
      setForm({ ...form, address: { ...form.address, [field]: value } });
    } else {
      setForm({ ...form, [field]: value });
    }
  };

  const updateProfile = async () => {
    setLoading(true);
    try {
      const updateData: { [key: string]: any } = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phoneNumber: form.phoneNumber,
        image: form.image,
        address: form.address,
      };

      if (showPasswordFields) {
        if (form.newPassword !== form.confirmPassword) {
          Alert.alert("Erro", "As novas senhas não coincidem.");
          setLoading(false);
          return;
        }
        updateData.currentPassword = form.currentPassword;
        updateData.newPassword = form.newPassword;
      }

      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`, // Assuming token is available
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao atualizar perfil.');
      }

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      closeEditModal();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("Erro", `Falha ao atualizar perfil: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const dayNameMap: { [key: string]: string } = {
    MONDAY: 'SEG',
    TUESDAY: 'TER',
    WEDNESDAY: 'QUA',
    THURSDAY: 'QUI',
    FRIDAY: 'SEX',
    SATURDAY: 'SÁB',
    SUNDAY: 'DOM'
  };

  if (loading || !provider || !dashboard) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text>Carregando perfil...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: provider?.avatar || 'https://i.pravatar.cc/100' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton} onPress={openEditModal}>
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.providerName}>{provider?.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{provider?.rating?.toFixed(1) || 'N/A'} • Prestador verificado</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações de Contato</Text>
          
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <Mail size={20} color="#6B7280" />
              <Text style={styles.infoText}>{provider?.email}</Text>
            </View>
            <View style={styles.infoItem}>
              <Phone size={20} color="#6B7280" />
              <Text style={styles.infoText}>{provider?.phone || 'Não informado'}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>Endereço: {provider.address?.street || ''}, {provider.address?.number || ''}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoText}>{provider.address?.neighborhood || ''}, {provider.address?.city || ''} - {provider.address?.state || ''}</Text>
            </View>
          </View>
        </View>

        {/* Dashboard Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas do Dashboard</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>R$ {dashboard.earnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Ganhos Totais</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dashboard.appointmentsCount}</Text>
              <Text style={styles.statLabel}>Agendamentos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{dashboard.averageRating.toFixed(1)}/5</Text>
              <Text style={styles.statLabel}>Avaliação Média</Text>
            </View>
          </View>
        </View>

        {/* Working Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horários de Trabalho (semana atual)</Text>
          <View style={styles.infoCard}>
            {dashboard.workingHours.length > 0 ? (
              dashboard.workingHours.map((day, index) => (
                <View key={index} style={styles.workingHourItem}>
                  <Text style={styles.workingHourDay}>{dayNameMap[day.day] || day.day}</Text>
                  {day.status === 'CLOSED' ? (
                    <Text style={styles.workingHourStatusClosed}>Fechado</Text>
                  ) : (
                    <View style={styles.workingHourTimeContainer}>
                      <Text style={styles.workingHourTime}>{day.start} às {day.break || day.end}</Text>
                      {day.break && (
                        <Text style={styles.workingHourTime}> e {day.restart} às {day.end}</Text>
                      )}
                    </View>
                  )}
                </View>
              ))
            ) : (
              <Text style={styles.noServicesText}>Nenhum horário de trabalho cadastrado.</Text>
            )}
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
            
            <TouchableOpacity style={styles.settingItem} onPress={openEditModal}>
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

      {/* Edit Profile Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Editar Perfil</Text>
              <TouchableOpacity onPress={closeEditModal}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Nome</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.firstName}
                  onChangeText={(text) => handleChange('firstName', text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Sobrenome</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.lastName}
                  onChangeText={(text) => handleChange('lastName', text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Email</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Telefone</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.phoneNumber}
                  onChangeText={(text) => handleChange('phoneNumber', text)}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>URL da Imagem</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.image}
                  onChangeText={(text) => handleChange('image', text)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Rua</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.address.street}
                  onChangeText={(text) => handleChange('street', text, true)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Número</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.address.number}
                  onChangeText={(text) => handleChange('number', text, true)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Bairro</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.address.neighborhood}
                  onChangeText={(text) => handleChange('neighborhood', text, true)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Cidade</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.address.city}
                  onChangeText={(text) => handleChange('city', text, true)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Estado</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.address.state}
                  onChangeText={(text) => handleChange('state', text, true)}
                />
              </View>
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>CEP</Text>
                <TextInput
                  style={styles.formInput}
                  value={form.address.zipCode}
                  onChangeText={(text) => handleChange('zipCode', text, true)}
                />
              </View>

              <TouchableOpacity onPress={togglePasswordFields} style={styles.togglePasswordButton}>
                <Text style={styles.togglePasswordText}>
                  {showPasswordFields ? 'Ocultar' : 'Alterar Senha'}
                </Text>
              </TouchableOpacity>

              {showPasswordFields && (
                <View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Senha Atual</Text>
                    <TextInput
                      style={styles.formInput}
                      value={form.currentPassword}
                      onChangeText={(text) => handleChange('currentPassword', text)}
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Nova Senha</Text>
                    <TextInput
                      style={styles.formInput}
                      value={form.newPassword}
                      onChangeText={(text) => handleChange('newPassword', text)}
                      secureTextEntry
                    />
                  </View>
                  <View style={styles.formGroup}>
                    <Text style={styles.formLabel}>Confirmar Nova Senha</Text>
                    <TextInput
                      style={styles.formInput}
                      value={form.confirmPassword}
                      onChangeText={(text) => handleChange('confirmPassword', text)}
                      secureTextEntry
                    />
                  </View>
                </View>
              )}

              <TouchableOpacity style={styles.updateButton} onPress={updateProfile} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.updateButtonText}>Atualizar</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    color: '#111827',
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceTag: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  serviceTagText: {
    fontSize: 14,
    color: '#10B981',
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
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
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
    color: '#111827',
  },
  logoutText: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  modalBody: {
    flexGrow: 1,
  },
  formGroup: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 5,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#111827',
  },
  togglePasswordButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  togglePasswordText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '500',
  },
  updateButton: {
    backgroundColor: '#10B981',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  workingHourItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  workingHourDay: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  workingHourStatusClosed: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  workingHourTimeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    justifyContent: 'flex-end',
  },
  workingHourTime: {
    color: '#10B981',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  noServicesText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});