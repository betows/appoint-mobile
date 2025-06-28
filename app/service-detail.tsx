import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'http://localhost:5000/api/v1';

interface Service {
  id: string;
  image?: string;
  category?: string;
  title: string;
  averageTime: string;
  price: number;
  purchaseCount: number;
  rating: number;
  ratingCount: number;
  description?: string;
  provider: {
    id: string;
    legalName: string;
  };
}

interface Rating {
  id: string;
  score: number;
  comment: string;
  customer: {
    name: string;
  };
}

export default function ServiceDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [relatedServices, setRelatedServices] = useState<Service[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);

  useEffect(() => {
    if (id) {
      fetchServiceDetails(id as string);
      fetchServiceRatings(id as string);
    }
  }, [id]);

  const fetchServiceDetails = async (serviceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/services/${serviceId}`);
      const data = await response.json();
      setService(data);
      fetchRelatedServices(data.category, serviceId);
    } catch (error) {
      console.error("Error fetching service details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceRatings = async (serviceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/service/${serviceId}`);
      const data = await response.json();
      setRatings(data);
    } catch (error) {
      console.error("Error fetching service ratings:", error);
    }
  };

  const fetchRelatedServices = async (category: string, currentServiceId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/services?category=${category}`);
      const data = await response.json();
      setRelatedServices(data.filter((s: Service) => s.id !== currentServiceId));
    } catch (error) {
      console.error("Error fetching related services:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Service not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.imageContainer}>
        {service.image ? (
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
        ) : (
          <View style={styles.placeholderImage} />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.categoryBadge}>{service.category || 'Outros'}</Text>
        <Text style={styles.title}>{service.title}</Text>
        <Text style={styles.detailText}>Tempo: {service.averageTime}</Text>
        <Text style={styles.detailText}>Preço: R${service.price}</Text>
        <Text style={styles.detailText}>Contratações: {service.purchaseCount}x</Text>
        <View style={styles.providerLinkContainer}>
          <Text style={styles.detailText}>Provider: </Text>
          <Link href={`/professional-detail?id=${service.provider.id}`} style={styles.providerLink}>
            {service.provider.legalName}
          </Link>
        </View>
        <Text style={styles.detailText}>
          Avaliações: {service.rating} ⭐ ({service.ratingCount} reviews)
        </Text>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'description' && styles.activeTabButton]}
          onPress={() => setActiveTab('description')}
        >
          <Text style={activeTab === 'description' && styles.activeTabText}>Descrição</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'ratings' && styles.activeTabButton]}
          onPress={() => setActiveTab('ratings')}
        >
          <Text style={activeTab === 'ratings' && styles.activeTabText}>Avaliações</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabContent}>
        {activeTab === 'description' ? (
          service.description ? (
            <Text style={styles.descriptionText}>{service.description}</Text>
          ) : (
            <Text style={styles.noDescriptionText}>O profissional não adicionou uma descrição ao serviço.</Text>
          )
        ) : (
          ratings.length > 0 ? (
            <View>
              {ratings.map((comment) => (
                <View key={comment.id} style={styles.ratingItem}>
                  <Text style={styles.ratingCustomerName}>{comment.customer.name}</Text>
                  <Text style={styles.ratingScore}>Rating: {comment.score} ⭐</Text>
                  <Text style={styles.ratingComment}>{comment.comment}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noDescriptionText}>Este serviço ainda não possui avaliações.</Text>
          )
        )}
      </View>

      {relatedServices.length > 0 && (
        <View style={styles.relatedServicesContainer}>
          <Text style={styles.relatedServicesTitle}>Serviços relacionados</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {relatedServices.map((relService) => (
              <Link href={`/service-detail?id=${relService.id}`} key={relService.id} style={styles.relatedServiceCard}>
                <Image
                  source={{ uri: relService.image || 'https://via.placeholder.com/100' }}
                  style={relService.image ? styles.relatedServiceImage : styles.relatedServicePlaceholder}
                />
                <View style={styles.relatedServiceInfo}>
                  <Text style={styles.relatedServiceTitle}>{relService.title}</Text>
                  <Text style={styles.relatedServiceDetail}>Tempo: {relService.averageTime}</Text>
                  <Text style={styles.relatedServiceDetail}>Preço: R${relService.price}</Text>
                  <Link href={`/professional-detail?id=${relService.provider.id}`} style={styles.relatedServiceProviderLink}>
                    {relService.provider.legalName || 'Ver Profissional'}
                  </Link>
                </View>
              </Link>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.scheduleButtonContainer}>
        <TouchableOpacity style={styles.scheduleButton} onPress={() => {
          router.push({
            pathname: '/booking-calendar',
            params: {
              providerId: service.provider.id,
              serviceId: service.id,
              averageTime: service.averageTime,
            },
          });
        }}>
          <Text style={styles.scheduleButtonText}>Agendar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
  header: {
    backgroundColor: '#10B981',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  backButton: {
    padding: 8,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60, // To account for the absolute header
  },
  serviceImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#10B981',
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    position: 'relative',
    zIndex: 10,
  },
  categoryBadge: {
    backgroundColor: '#D1FAE5',
    color: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#1F2937',
  },
  detailText: {
    fontSize: 16,
    color: '#4B5563',
    marginTop: 4,
  },
  providerLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  providerLink: {
    fontSize: 16,
    color: '#10B981',
    textDecorationLine: 'underline',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    marginHorizontal: 16,
    marginTop: 16,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: '#10B981',
  },
  activeTabText: {
    fontWeight: 'bold',
    color: '#10B981',
  },
  tabContent: {
    padding: 16,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  noDescriptionText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  ratingItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 12,
  },
  ratingCustomerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  ratingScore: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  ratingComment: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
  },
  relatedServicesContainer: {
    padding: 16,
    backgroundColor: '#F3F4F6',
    marginTop: 20,
  },
  relatedServicesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  relatedServiceCard: {
    width: 160,
    marginRight: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  relatedServiceImage: {
    width: '100%',
    height: 80,
    resizeMode: 'cover',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  relatedServicePlaceholder: {
    width: '100%',
    height: 80,
    backgroundColor: '#D1FAE5',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedServiceInfo: {
    padding: 8,
  },
  relatedServiceTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  relatedServiceDetail: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  relatedServiceProviderLink: {
    fontSize: 12,
    color: '#10B981',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  scheduleButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    alignItems: 'flex-end',
  },
  scheduleButton: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
