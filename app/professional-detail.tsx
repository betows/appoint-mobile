import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const API_BASE_URL = 'http://localhost:5000/api/v1';

interface Provider {
  id: string;
  legalName: string;
  email: string;
  phone: string;
  avatar?: string;
  rating: number;
  services: Service[];
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

interface Service {
  id: string;
  title: string;
  averageTime: string;
  price: number;
  image?: string;
}

export default function ProfessionalDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchProviderDetails(id as string);
    }
  }, [id]);

  const fetchProviderDetails = async (providerId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/providers/${providerId}`);
      const data = await response.json();
      setProvider(data);
    } catch (error) {
      console.error("Error fetching provider details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!provider) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Provider not found.</Text>
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

      <View style={styles.profileHeader}>
        <Image source={{ uri: provider.avatar || 'https://via.placeholder.com/150' }} style={styles.avatar} />
        <Text style={styles.providerName}>{provider.legalName}</Text>
        <Text style={styles.providerRating}>Avaliação: {provider.rating} ⭐</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contato</Text>
        <Text style={styles.detailText}>Email: {provider.email}</Text>
        <Text style={styles.detailText}>Telefone: {provider.phone}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Endereço</Text>
        <Text style={styles.detailText}>Rua: {provider.address.street}, {provider.address.number}</Text>
        <Text style={styles.detailText}>Bairro: {provider.address.neighborhood}</Text>
        <Text style={styles.detailText}>Cidade: {provider.address.city} - {provider.address.state}</Text>
        <Text style={styles.detailText}>CEP: {provider.address.zipCode}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Serviços Oferecidos</Text>
        {provider.services.length > 0 ? (
          provider.services.map((service) => (
            <Link href={`/service-detail?id=${service.id}`} key={service.id} style={styles.serviceCard}>
              <Image source={{ uri: service.image || 'https://via.placeholder.com/100' }} style={styles.serviceImage} />
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceDetail}>Tempo: {service.averageTime}</Text>
                <Text style={styles.serviceDetail}>Preço: R${service.price}</Text>
              </View>
            </Link>
          ))
        ) : (
          <Text style={styles.noServicesText}>Nenhum serviço cadastrado.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginTop: 60, // To account for the absolute header
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  providerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  providerRating: {
    fontSize: 18,
    color: '#4B5563',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 5,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  serviceImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
    resizeMode: 'cover',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  serviceDetail: {
    fontSize: 14,
    color: '#4B5563',
  },
  noServicesText: {
    fontSize: 16,
    color: '#6B7280',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
});
