import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Edit, Phone, Mail, Settings, LogOut, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth, User } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

export default function CustomerProfile() {
  const { user, logout } = useAuth();
  const [customer, setCustomer] = useState<User | null>(user);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phoneNumber: user?.phone || '',
    image: user?.avatar || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (user) {
      setCustomer(user);
      setForm({
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        image: user.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  }, [user]);

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
    // Reset form to current user data on close
    if (user) {
      setForm({
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phoneNumber: user.phone || '',
        image: user.avatar || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const togglePasswordFields = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
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

      // Update local user state (AuthContext should handle this in a real app)
      if (user) {
        const updatedUser: User = {
          ...user,
          name: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phoneNumber,
          avatar: form.image,
        };
        // In a real app, you'd call a setUser function from AuthContext here
        // For now, we'll just update the local state
        setCustomer(updatedUser);
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

  if (!customer) {
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
              source={{ uri: customer?.avatar || 'https://i.pravatar.cc/100' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton} onPress={openEditModal}>
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
              <Text style={styles.infoText}>{customer?.phone || 'Não informado'}</Text>
            </View>
            <View style={styles.infoItem}>
              {/* Address is not directly available in User interface, assuming it's part of a larger customer object */}
              <Text style={styles.infoText}>São Paulo, SP</Text>
            </View>
          </View>
        </View>

        {/* Statistics - Placeholder for now, as backend doesn't provide these directly for customer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Estatísticas</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Serviços Contratados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Avaliação Média</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>R$ 0</Text>
              <Text style={styles.statLabel}>Total Investido</Text>
            </View>
          </View>
        </View>

        {/* Favorite Categories - Placeholder for now */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categorias Favoritas</Text>
          
          <View style={styles.categoriesContainer}>
            <View style={styles.categoryTag}>
              <Text style={styles.categoryTagText}>Nenhuma</Text>
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
  customerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  customerEmail: {
    fontSize: 16,
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
});