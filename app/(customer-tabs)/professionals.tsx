import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Star, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Professional {
  id: string;
  legalName: string;
  image: string;
  rating: number;
  ratingCount: number;
  description: string;
  address: { street: string; number: string; cep: string; id: string };
  servicesCount: number;
  categories: string[];
}

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  averageTime: string;
  image: string;
  category: { name: string };
  provider: { id: string; legalName: string };
}

export default function Professionals() {
  const { search } = useLocalSearchParams<{ search?: string }>();
  const { user, isLoading: authLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState(search || '');
  const [activeTab, setActiveTab] = useState<'profissionais' | 'servicos'>('profissionais');
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfessionals = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await api.get<{ result: Professional[] }>(`/marketplace/providers?search=${searchQuery}`, user.token);
      setProfessionals(data.result);
    } catch (error) {
      console.error('Failed to fetch professionals:', error);
      Alert.alert('Erro', 'Falha ao carregar profissionais.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, user?.token]);

  const fetchServices = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const data = await api.get<Service[]>(`/marketplace/services?search=${searchQuery}`, user.token);
      setServices(data.map((s: any) => ({ ...s, category: s.category })));
    } catch (error) {
      console.error('Failed to fetch services:', error);
      Alert.alert('Erro', 'Falha ao carregar serviços.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, user?.token]);

  useEffect(() => {
    if (activeTab === 'profissionais') {
      fetchProfessionals();
    } else {
      fetchServices();
    }
  }, [activeTab, fetchProfessionals, fetchServices]);

  useEffect(() => {
    if (search) {
      setSearchQuery(search);
    }
  }, [search]);

  const handleChatPress = (professionalId: string, professionalName: string) => {
    router.push({
      pathname: '/chat-detail',
      params: { professionalId, professionalName }
    });
  };

  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.headerTitle}>Buscar</Text>
              <TouchableOpacity 
                style={styles.chatButton}
                onPress={() => router.push('/chat')}
              >
                <MessageCircle size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <Search size={20} color="#6B7280" />
                <TextInput
                  style={styles.searchInput}
                  placeholder={`Buscar ${activeTab === 'profissionais' ? 'profissionais' : 'serviços'}...`}
                  placeholderTextColor="#6B7280"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={() => { /* Trigger fetch on submit */ if (activeTab === 'profissionais') fetchProfessionals(); else fetchServices(); }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'profissionais' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('profissionais')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'profissionais' && styles.activeTabText,
            ]}
          >
            Profissionais
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'servicos' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('servicos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'servicos' && styles.activeTabText,
            ]}
          >
            Serviços
          </Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.contentContainer}>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Professionals Tab */}
          {activeTab === 'profissionais' && (
            <>
              {professionals.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>Nenhum profissional encontrado</Text>
                  <Text style={styles.emptySubtitle}>
                    Tente ajustar sua busca ou explore outras categorias
                  </Text>
                </View>
              ) : (
                professionals.map((professional) => (
                  <TouchableOpacity
                    key={professional.id}
                    style={styles.professionalCard}
                    onPress={() => {
                      if (professional.id) {
                        router.push({
                          pathname: '/professional-detail',
                          params: { professionalId: professional.id }
                        });
                      } else {
                        Alert.alert('Erro', 'ID do profissional não encontrado.');
                      }
                    }}
                  >
                    <Image
                      source={{ uri: professional.image || 'https://via.placeholder.com/56' }}
                      style={styles.professionalAvatar}
                    />
                    <View style={styles.professionalInfo}>
                      <Text style={styles.professionalName}>{professional.legalName}</Text>
                      <View style={styles.professionalRating}>
                        <Star size={14} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.professionalRatingText}>
                          {professional.rating} • {professional.servicesCount} serviços
                        </Text>
                      </View>
                      <Text style={styles.professionalCategory}>{professional.categories.join(', ')}</Text>
                      <Text style={styles.professionalAddress}>{professional.address?.street || ''}</Text>
                    </View>
                    <View style={styles.professionalActions}>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          handleChatPress(professional.id, professional.legalName);
                        }}
                      >
                        <MessageCircle size={20} color="#10B981" />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {/* Services Tab */}
          {activeTab === 'servicos' && (
            <>
              {services.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>Nenhum serviço encontrado</Text>
                  <Text style={styles.emptySubtitle}>
                    Tente ajustar sua busca ou explore outras categorias
                  </Text>
                </View>
              ) : (
                services.map((service) => (
                  <TouchableOpacity
                    key={service.id}
                    style={styles.serviceCard}
                    onPress={() => {
                      if (service.id) {
                        router.push({
                          pathname: '/service-detail',
                          params: { serviceId: service.id }
                        });
                      } else {
                        Alert.alert('Erro', 'ID do serviço não encontrado.');
                      }
                    }}
                  >
                    <Image
                      source={{ uri: service.image || 'https://via.placeholder.com/80' }}
                      style={styles.serviceImage}
                    />
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{service.title}</Text>
                      <Text style={styles.servicePrice}>R$ {service.price}</Text>
                      <Text style={styles.serviceDuration}>{service.averageTime}</Text>
                      <View style={styles.serviceRating}>
                        <Star size={12} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.serviceRatingText}>
                          {service.provider.legalName} ({service.category.name})
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
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
    paddingBottom: 32,
  },
  headerSafeArea: {
    paddingHorizontal: 24,
  },
  headerContent: {
    marginTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  chatButton: {
    padding: 4,
  },
  searchContainer: {
    marginTop: -8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 20,
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
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  professionalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  professionalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  professionalRatingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  professionalCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 2,
  },
  professionalAddress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  professionalActions: {
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 2,
  },
  serviceDuration: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  serviceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  serviceRatingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  serviceCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
});