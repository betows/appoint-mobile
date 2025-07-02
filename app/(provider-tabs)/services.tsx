import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, CreditCard as Edit, Trash2, Clock, DollarSign } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string; // Assuming duration is a string like "1h 30min"
  rating: number;
  reviews: number;
  category: string;
  image: string;
}

import api from '@/services/api';

export default function ProviderServices() {
  const { user, isLoading: authLoading } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  const fetchServices = useCallback(async () => {
    if (!user?.token || !user?.id) {
      setLoadingServices(false);
      return;
    }
    setLoadingServices(true);
    try {
      const data = await api.get<{ services: Service[] }>(`/marketplace/providers/${user.id}/services`, user.token);
      setServices(data.services || []);
    } catch (error) {
      console.error('Failed to fetch services:', error);
      Alert.alert('Erro', 'Falha ao carregar serviços. Tente novamente.');
    } finally {
      setLoadingServices(false);
    }
  }, [user]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleAddService = () => {
    Alert.alert(
      'Adicionar Serviço',
      'Funcionalidade de adicionar serviço será implementada em breve no backend.',
      [{ text: 'OK' }]
    );
    // TODO: Implement backend call for adding a service
  };

  const handleEditService = (serviceId: string) => {
    Alert.alert(
      'Editar Serviço',
      'Funcionalidade de editar serviço será implementada em breve no backend.',
      [{ text: 'OK' }]
    );
    // TODO: Implement backend call for editing a service
  };

  const handleDeleteService = (serviceId: string) => {
    Alert.alert(
      'Excluir Serviço',
      'Tem certeza que deseja excluir este serviço?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement backend call for deleting a service
            setServices(prev => prev.filter(service => service.id !== serviceId));
            Alert.alert('Sucesso', 'Serviço excluído com sucesso (simulado)!');
          }
        }
      ]
    );
  };

  if (authLoading || loadingServices) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando serviços...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Meus Serviços</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddService}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {services.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum serviço cadastrado</Text>
            <Text style={styles.emptySubtitle}>
              Adicione seus primeiros serviços para começar a receber clientes
            </Text>
            <TouchableOpacity style={styles.emptyButton} onPress={handleAddService}>
              <Plus size={20} color="#10B981" />
              <Text style={styles.emptyButtonText}>Adicionar Serviço</Text>
            </TouchableOpacity>
          </View>
        ) : (
          services.map((service) => (
            <View key={service.id} style={styles.serviceCard}>
              <Image
                source={{ uri: service.image || 'https://via.placeholder.com/150' }}
                style={styles.serviceImage}
              />
              <View style={styles.serviceInfo}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.serviceActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleEditService(service.id)}
                    >
                      <Edit size={16} color="#6B7280" />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleDeleteService(service.id)}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.serviceDescription}>{service.description}</Text>
                
                <View style={styles.serviceDetails}>
                  <View style={styles.detailItem}>
                    <DollarSign size={14} color="#10B981" />
                    <Text style={styles.detailText}>R$ {service.price}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.detailText}>{service.duration}</Text>
                  </View>
                </View>
                
                <View style={styles.serviceStats}>
                  <Text style={styles.statText}>
                    ⭐ {service.rating} ({service.reviews} avaliações)
                  </Text>
                  <Text style={styles.categoryText}>{service.category}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
    gap: 8,
  },
  emptyButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 120,
  },
  serviceInfo: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 8,
},
  actionButton: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: '#F9FAFB',
  },
  serviceDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  serviceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
});