import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Star, Clock, MessageCircle } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  averageTime: string;
  image: string;
  category: string;
}

interface Professional {
  id: string;
  legalName: string;
  rating: number;
  image: string;
  description: string;
  ratingCount: number;
  user: {
    id: string;
    address: {
      street: string;
      number: string;
      cep: string;
      id: string;
    };
  };
  services: Service[];
}

export default function ProfessionalDetail() {
  const { professionalId } = useLocalSearchParams<{ professionalId: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Serviços');
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfessional = async () => {
      if (!professionalId || !user?.token) return;
      setLoading(true);
      try {
        const data = await api.get<Professional>(`/marketplace/providers/${professionalId}`, user.token);
        setProfessional(data);
      } catch (error) {
        console.error('Failed to fetch professional:', error);
        Alert.alert('Erro', 'Falha ao carregar detalhes do profissional.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfessional();
  }, [professionalId, user?.token]);

  const handleChatPress = () => {
    if (professional) {
      router.push({
        pathname: '/chat-detail',
        params: { professionalId: professional.id, professionalName: professional.legalName }
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando profissional...</Text>
      </SafeAreaView>
    );
  }

  if (!professional) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Profissional não encontrado.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with background image */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: professional.image || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400&h=200&dpr=2' }}
            style={styles.backgroundImage}
          />
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Professional Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Image
              source={{ uri: professional.image || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=2' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.chatButton} onPress={handleChatPress}>
              <MessageCircle size={20} color="#FFFFFF" />
              <Text style={styles.chatButtonText}>Conversar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.professionalName}>{professional.legalName}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{professional.rating} ({professional.ratingCount} avaliações)</Text>
          </View>
          <Text style={styles.description}>{professional.description}</Text>
          <Text style={styles.address}>Endereço: {professional.user?.address?.street || 'N/A'}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Serviços' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Serviços')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Serviços' && styles.activeTabText,
              ]}
            >
              Serviços
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Avaliações' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Avaliações')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Avaliações' && styles.activeTabText,
              ]}
            >
              Avaliações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Services */}
        {activeTab === 'Serviços' && (
          <View style={styles.servicesSection}>
            <Text style={styles.sectionTitle}>Serviços oferecidos</Text>
            {professional.services.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum serviço disponível.</Text>
            ) : (
              professional.services.map((service) => (
                <TouchableOpacity
                  key={service.id}
                  style={styles.serviceCard}
                  onPress={() => router.push({
                    pathname: '/service-detail',
                    params: { serviceId: service.id, providerId: professional.id }
                  })}
                >
                  <Image
                    source={{ uri: service.image || 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=60&h=60&dpr=2' }}
                    style={styles.serviceImage}
                  />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.title}</Text>
                    <Text style={styles.servicePrice}>R$ {service.price}</Text>
                    <View style={styles.serviceDuration}>
                      <Clock size={14} color="#6B7280" />
                      <Text style={styles.durationText}>{service.averageTime}</Text>
                    </View>
                    <Text style={styles.serviceCategory}>{service.category}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Reviews */}
        {activeTab === 'Avaliações' && (
          <View style={styles.reviewsSection}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' }}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>João Silva</Text>
                  <View style={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} color="#F59E0B" fill="#F59E0B" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>
                Excelente profissional! Muito pontual e eficiente. Recomendo!
              </Text>
            </View>
          </View>
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
  headerContainer: {
    height: 200,
    position: 'relative',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    padding: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    marginTop: -40,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  chatButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  professionalName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 24,
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
  servicesSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
  },
  serviceCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceImage: {
    width: 60,
    height: 60,
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
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
    marginBottom: 4,
  },
  serviceDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  durationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  serviceCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
  },
  reviewsSection: {
    padding: 24,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
});